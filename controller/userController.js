var bcrypt = require('bcrypt-nodejs');
var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';

/**definire database, apertura e chiusura
 * definire gli errori
 * definire le funzioni solo con  req,res,done
 * 
 */

exports.addUser = function(req, res, done) {

    let db = new sqlite3.Database(database);

    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password_confirm = req.body.password_confirm;


    db.get(
        'SELECT * FROM users WHERE name = ?',
        username,
        function(err, row) {
            console.log('entra nella funzione');
            if (row != undefined) {
                console.log('nome utente già in uso');
                res.redirect('/registration');

                //return done(null, false, { message: 'Nome utente già in uso' });


            } else if (username == '') {
                console.log('campo username vuoto');
                res.redirect('/registration');


                //return done(null, false, { message: 'Campo nome utente vuoto' });

            } else if (email == '') {
                console.log('campo email vuoto');
                res.redirect('/registration');


                //return done(null, false, { message: 'Campo email vuoto' });

            } else if (password.length < 6) {
                console.log('password troppo corta');
                res.redirect('/registration');


                //return done(null, false, { message: 'Password troppo breve' });


            } else {

                db.get(
                    'SELECT * FROM users WHERE email = ?',
                    email,
                    function(err, row) {
                        console.log('entra nella funzione');

                        if (row != undefined) {
                            console.log('Email già in uso');
                            res.redirect('/registration');

                            //return done(null, false, { message: 'Email già in uso' });

                        } else if (password_confirm != password) {
                            console.log('le password non corrispondono');
                            res.redirect('/registration');

                            //return done(null, false, { message: 'Le password inserite non coincidono' })

                        } else {

                            var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

                            db.run('INSERT INTO users(name, email, password) VALUES (?, ?, ?);', username, email, hash);

                            //return done(null, false, { message: true });
                            res.redirect('/');
                            //console.log('dovrebbe inserirlo');

                        }

                    }

                )
            }
        }

    )


    db.close();

};

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
    //metodo che mostra i pg acquistabili da quel'utente
exports.loadPG = function(req, res, next) {

    //Caricamento pg per eventuale aggiunta a collezione lato player

    let db = new sqlite3.Database(database);
    var session = req.session;
    var idUser = session.user;
    console.log(idUser);
    // var pgAcquistabiliarr = []
    db.all('SELECT * FROM characters WHERE id NOT IN (SELECT char_id FROM users_characters WHERE user_id = ?)',
        idUser,
        function(err, rows) {
            console.log(rows);
            res.render('player/playerhome', {
                pgAcquistabile: rows
            });
        });

    db.close();
}

exports.logout = function(req, res) {

    req.session.user = undefined;
    res.redirect('/');

}