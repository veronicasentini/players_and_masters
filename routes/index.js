var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';
var bcrypt = require('bcrypt-nodejs');

/*var userController = require('./controller/userController');*/




router.use('/user', require('./users.js'));
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/login', { title: 'P&M' });
});

router.post('/', function(req, res, next) {
    res.render('player/playerhome');
});

router.get('/registration', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/registration', { messages: messages, hasErrors: messages.length > 0 });
});


router.post('/registration', function addUser(req, res, done) {

    let db = new sqlite3.Database(database);

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password_confirm = req.body.password_confirm;


    db.each(
        'SELECT * FROM users WHERE name = ?',
        username,
        function(err, row) {

            if (row != undefined) {

                res.redirect('/registration');

                return done(null, false, { message: 'Nome utente già in uso' });

            } else if (username == '') {

                res.redirect('/registration');

                return done(null, false, { message: 'Campo nome utente vuoto' });

            } else if (email == '') {

                res.redirect('/registration');

                return done(null, false, { message: 'Campo email vuoto' });

            } else if (password.length < 6) {

                res.redirect('/registration');

                return done(null, false, { message: 'Password troppo breve' });

            } else {

                db.each(
                    'SELECT * FROM users WHERE email = ?',
                    email,
                    function(err, row) {

                        if (row != undefined) {

                            res.redirect('/registration');

                            return done(null, false, { message: 'Email già in uso' });

                        } else {

                            if (password_confirm != password) {

                                res.redirect('/registration');

                                return done(null, false, { message: 'Le password inserite non coincidono' })

                            } else {

                                var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

                                db.run('INSERT INTO users(name, email, password) VALUES (?, ?, ?);', username, email, hash);

                                res.redirect('/');

                                return done(null, false, { message: true });
                            }
                        }
                    }
                )
            }
        }
    )

    db.close();

});

module.exports = router;