var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';

exports.addPG = function(req, idpg, res, done) {

    //aggiunta di un pg alla collezione player 

    let db = new sqlite3.Database(database);

    var id_player = req.session.user;
    var id_pg = pgAcquistabile.id;

    db.each(
        'SELECT * FROM user_characters WHERE user_id = ?',
        id_player,
        function(row) {

            if (row.char_id != id_pg) {

                db.run('INSERT INTO users_character(user_id, char_id) VALUES (?, ?);', id_player, id_pg)

            } else {

                return done(null, false, { message: 'Personaggio selezionato già aggiunto alla collezione' })

            }
        }
    );

    db.close();

    //res ricarica la pagina eliminando il pg appena aggiunto

}