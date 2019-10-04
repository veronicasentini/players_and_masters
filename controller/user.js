//var db = require('./db');

var sqlite3 = require('sqlite3').verbose();
const database = '../players_and_masters.db';

var bcrypt = require('bcrypt-nodejs');

module.exports = {
    redirect: function(req, res, next) {
        res.redirect('/');
    }
}

module.exports = {
    addUser: function(req, res, done) {
        console.log("entra nel metodo");
        let db = new sqlite3.Database(database);

        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var password_confirm = req.body.password_confirm;

        if (password_confirm != password) {
            //  return done(null, false, { message: 'Le password inserite non coincidono' })
        }

        db.get(
            'SELECT * FROM users WHERE username = ?',
            username,
            function(err, row) {
                if (row == undifined) {


                    //  return done(null, false, { message: 'Nome utente già in uso' });
                }
            }
        );

        db.get(
            'SELECT * FROM users WHERE email = ?',
            email,
            function(err, row) {
                //  return done(null, false, { message: 'Email già in uso' });
            }
        );

        var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

        db.run('INSERT INTO users(name, email, password) VALUES (?, ?, ?);', username, email, hash);
        // res.redirect('/');
        // return done(null, false, { message: true });
        db.close();
    },

    login: function(res, done) {
        var email = req.body.email;

        db.get(
            'SELECT * FROM users WHERE email = ?',
            email,
            function(row, password) {
                if (row != undefined) {
                    if (bcrypt.compareSync(password, row.password)) {
                        verified = true;
                        session = req.session;
                        session.user = row.id;
                        res.redirect('/user');
                    } else {
                        res.redirect('/');
                        return done(null, false, { message: 'Password errata' });
                    }
                } else {
                    res.redirect('/');
                    return done(null, false, { message: 'Email non registrata' });
                }
            }
        );
    },

    logout: function(res) {
        req.session.user = undefined;
        res.redirect('/');
    }
};