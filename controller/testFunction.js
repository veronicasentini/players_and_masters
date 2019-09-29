var db = require('./db');
var bcrypt = require('bcrypt-nodejs');

function searchPG(req, res, done) {
    
    //master che cerca un pg
    
    var nomepg = req.body.nomepg;
    var nomeplayer = req.body.usernamePlayer;
    var idSessione = session.user;
    
    db.each(
        'SELECT * FROM party WHERE master = ?',
        idSessione, 
        
        function (row) {
            party = row.id;
            db.all(
                'SELECT * FROM user_characters JOIN user_parties WHERE party_id != ?',
                party, 
                
                //db.all restituisce un array, prendendo le info user_id e char_id si possono recuperare i nomi da stampare

                function(){
                    
                            //stampa l'array
                }
                    
            );
        }
    );
};