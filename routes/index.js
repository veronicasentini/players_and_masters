var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';
var bcrypt = require('bcrypt-nodejs');
var errors = require('express-validator-errors');

const userController = require('../controller/userController');
/*var userController = require('./controller/userController');*/




router.use('/user', require('./users.js'));
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('user/login', { title: 'P&M' });
});

/*router.post('/', function(req, res, done) {

    let db = new sqlite3.Database(database);

    var email = req.body.email;
    var password = req.body.password;

    db.get(
        'SELECT * FROM users WHERE email = ?',
        email,
        function(err, row) {
            if (row != undefined) {
                console.log('email esiste');
                if (bcrypt.compareSync(password, row.password)) {
                    verified = true;
                    session = req.session;
                    session.user = row.id;
                    console.log(session.user);
                    res.redirect('/user/player');

                } else {
                    console.log('password errata');
                    res.redirect('/');
                    // return done(null, false, { message: 'Password errata' });
                }
            } else {
                console.log('email non registrata');
                res.redirect('/');
                //return done(null, false, { message: 'Email non registrata' });
            }
        }
    );

    db.close();

});*/

router.post('/', userController.login);

router.get('/registration', function(req, res, next) {

    res.render('user/registration')
});


router.post('/registration', userController.addUser);

router.get('/logout', userController.logout);

module.exports = router;