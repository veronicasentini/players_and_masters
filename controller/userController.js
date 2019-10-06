var bcrypt = require('bcrypt-nodejs');
var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';
/**definire database, apertura e chiusura
 * definire gli errori
 * definire le funzioni solo con  req,res,done
 * 
 */

function addUser(req, res, done) {

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

                return done(null, false, { message: 'Nome utente già in uso' });

            } else {

                db.each(
                    'SELECT * FROM users WHERE email = ?',
                    email,
                    function(err, row) {

                        if (row != undefined) {

                            return done(null, false, { message: 'Email già in uso' });

                        } else {

                            if (password_confirm != password) {

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

}

exports.login = function(req, res) {

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

}

function logout(req, res) {

    req.session.user = undefined;
    res.redirect('/');

}