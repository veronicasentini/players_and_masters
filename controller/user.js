//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var bcrypt = require('bcrypt-nodejs');

/*passport.serializeUser(function(user, done) {
    done(null, user);
})

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, */
function addUser(req, email, password, done) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password_confirm = req.body.password_confirm;

    if (password_confirm != password) {
        return done(null, false, {message: 'Le password inserite non coincidono'})
    }

    db.each(
        'SELECT * FROM users WHERE username = ?',
        username,
        function(err, row) {
            return done(null, false, {message: 'Nome utente già in uso'});
        }
    );

    db.each(
        'SELECT * FROM users WHERE email = ?',
        email, 
        function(err, row) {
            return done(null, false, {message: 'Email già in uso'});
        }
    );

    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

    db.run('INSERT INTO users(name, email, password) VALUES (?, ?, ?);', username, email, hash);

    return done(null, false, {message: true});
};

function login(req, res, done) {
    var email = req.body.email;
   
    db.get(
        'SELECT * FROM users WHERE email = ?',
        email, 
        function (row, password) {
            if (row != undefined){
                if (bcrypt.compareSync(password,row.password)){
                    verified = true;
                    session = req.session;
                    session.user = row.id;
                    res.redirect('/user');
                }
                else{
                    res.redirect('/');
                    return done(null, false, {message: 'Password errata'});
                }
            }
            else{
                res.redirect('/');
                return done(null, false, {message: 'Email non registrata'});
            }
    });

    function logout(req, res){
        req.session.user=undefined;
        res.redirect('/');
    }

};
