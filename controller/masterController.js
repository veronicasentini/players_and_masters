var bcrypt = require('bcrypt-nodejs');
var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';


function addParty(req, res) {

    var idMaster = req.session.user;
    var nomePartyMaster = req.body.nomePartyMaster;
    console.log(idMaster);
    console.log(nomePartyMaster);
    let db = new sqlite3.Database(database);

    db.get(
        'SELECT * FROM party WHERE name=? AND master=?',
        nomePartyMaster,
        idMaster,
        function(err, row) {
            console.log(idMaster);
            console.log(nomePartyMaster);
            console.log('row' + row);
            if (row != undefined) {
                console.log('party già esistente');
                res.redirect('/user/master');
            } else {
                console.log('nuovo party creato');
                db.run('INSERT INTO party(name, master) VALUES (?,?) ',
                    nomePartyMaster,
                    idMaster);
                res.redirect('/user/master');

            }
        }
    );
    db.close();
}
exports.loadParty = function(req, res, done) {
    var masterId = req.session.user;

    let db = new sqlite3.Database(database);
    db.all('SELECT * FROM party WHERE master=?',
        masterId,
        function(err, rows) {
            console.log(rows);
            res.render('master/masterhome', {
                partyAttivi: rows
            });

        });

    db.close();
};

exports.searchPG = function(req, res, done) {

    //master che cerca un pg
    let db = new sqlite3.Database(database);

    var nomeplayer = req.body.username;
    var idMaster = req.session.user;
    db.all('SELECT * FROM users_characters JOIN users ON users.id = users_character.user_id WHERE users.name = ? AND user_character.user_id != ?',
        nomeplayer,
        idMaster,

        function(err, rows) {
            if (rows != undefined) {
                db.all('SELECT * FROM characters JOIN users_characters ON characters.id=users_characters.char_id WHERE users_characters.user_id=?',
                    rows.user_id,
                    function(err, rows) {
                        res.render('/master/masterhome', {
                            personaggiCercati: rows

                        });

                    }
                )
            } else if (nomePlayer == '') {
                console.log('campo player vuoto');
                res.redirect('/master/mastehome');
            } else {
                console.log('row undefined')
                res.redirect('/master/masterhome')
            }
        }
    )

};



exports.addPGParty = function(req, res) {

    //aggiunta di un pg ad un party

    let db = new sqlite3.Database(database);

    var party = req.body.party;
    var id_master = req.session.user;
    var id_party;
    var id_player;
    var id_pg;


    db.get(
        'SELECT * FROM party WHERE name = ?, master = ?',
        party,
        id_master,
        function(row) {
            id_party = row.id;
        }
    );

    db.get(
        'SELECT * FROM users WHERE name = ?',
        playerriga,
        function(row) {
            id_player = row.id;
        }
    );

    db.get(
        'SELECT * FROM characters WHERE name = ?',
        pgriga,
        function(row) {
            id_pg = row.id;
        }
    );

    db.each(
        'SELECT * FROM user_parties WHERE user_id = ?, char_id = ?',
        id_player,
        id_pg,
        function(row) {

            db.all(
                'SELECT * FROM user_parties WHERE party_id = ?',
                id_party,
                function(rows) {
                    if (rows.length > 6) {
                        return done(null, false, { message: 'Party completo, si prega di selezionare un altro party' })
                    } else {

                        if (id_party != row.party_id) {

                            db.run('INSERT INTO user_parties(user_id, char_id, party_id) VALUES (?, ?, ?);', id_player, id_pg, id_party)

                        } else {

                            return done(null, false, { message: 'Personaggio selezionato già presente nel party indicato' })

                        }

                    }

                }
            )
        }
    )

    db.close();

}




exports.addPG = function(req, idpg, res, done) {

    //aggiunta di un pg alla collezione player 

    let db = new sqlite3.Database(database);

    var id_player = req.session.user;
    var id_pg = idpg;

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

}
module.exports.addParty = addParty;