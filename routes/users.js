var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';
/* GET users listing. */

router.get('/player', function(req, res) {
    res.render('player/playerhome');
});
/*router.get('/player', function loadPG(req, res, done) {
    console.log("entra nel metodo");
    let db = new sqlite3.Database(database);
    //Caricamento pg per eventuale aggiunta a collezione lato player

    db.all(
        'SELECT * FROM characters',

        function(err, rows) {
            num = rows.length;
            console.log(rows.length);
            var risultati = new Array[num][3];

            for (i = 0; i < num; i++) {

                risultati[i][0] = rows[i].name;
                risultati[i][1] = rows[i].class;
                risultati[i][2] = rows[i].id;

            }

            var table = "<table>"

            for (i = 0; i < num; i++) {
                table += "<tr>";
                table += "<tc>" + risultati[i][0] + "</tc>";
                table += "<tc>" + risultati[i][1] + "</tc>";
                table += "<button onclick = addPG(req, risultati[i][2], res, done)>" + "+" + "</button>";
                table += "</tr>";
            }

            table += "</table>";

            document.getElementById(".nonPosseduti").innerHTML = table;

        }

    );
    res.render('player/playerhome');
});*/


router.get('/master', function(req, res) {
    res.render('master/masterhome');
});
module.exports = router;