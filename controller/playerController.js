var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';

exports.addPG = function(req, res) {

    //aggiunta di un pg alla collezione player 

    let db = new sqlite3.Database(database);

    var id_player = req.session.user;
    var nomePg = req.body.nomePersonaggio;
    var id_Pg;
    db.get(
        'SELECT * FROM characters WHERE name=?',
        nomePg,
        function(err, row) {
            console.log(row);
            if (row != undefined) {
                id_Pg = row.id;
                console.log('id_Pg' + id_Pg);
                db.get(
                    'SELECT * FROM users_characters WHERE user_id = ? AND char_id=?',
                    id_player,
                    id_Pg,
                    function(err, row) {
                        console.log(id_Pg);
                        if (row != undefined) {
                            console.log(row);
                            console.log('pg già posseduto');
                            res.redirect('/user/player');

                            //db.run('INSERT INTO users_character(user_id, char_id) VALUES (?, ?);', id_player, id_pg)

                        } else {
                            console.log('pg non posseduto');
                            db.run('INSERT INTO users_characters (user_id, char_id) VALUES (?,?);', id_player, id_Pg);
                            res.redirect('/user/player');

                            // return done(null, false, { message: 'Personaggio selezionato già aggiunto alla collezione' })

                        }
                    }
                );
            } else {
                console.log('pg inesistente')
                res.redirect('/user/player');
            }
        }
    );


    db.close();

    //res ricarica la pagina eliminando il pg appena aggiunto

}