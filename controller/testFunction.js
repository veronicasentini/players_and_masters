var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';

exports.loadPG = function(req, res, next) {

    //Caricamento pg per eventuale aggiunta a collezione lato player

    let db = new sqlite3.Database(database);
    var idUser = session.user;
    var pgAcquistabiliarr = []
    db.all(
        'SELECT * FROM users_characters JOIN users JOIN characters WHERE characters.id= users_characters.char_id AND users.id=users_characters.user_id AND users_characters.user_id !=?',
        idUser,
        function(err, rows) {
            rows.forEach(row => {
                var idCharacter = row.char_id;
                db.all(
                    'SELECT * FROM characters WHERE characters.id= ',
                    idCharacter,
                    function(err, rows) {
                        rows.forEach(row => {
                            nomePg = rows.name;
                            pgAcquistabili.push(nomePg)
                        });

                    });
            });

        });
    db.close();
}