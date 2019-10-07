var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
const database = './players_and_masters.db';
const userController = require('../controller/userController');
/* GET users listing. */
const playerController = require('../controller/playerController');
const masterController = require('../controller/masterController');
var checkAuthentication = function(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        // user doesn't have access, return an HTTP 401 response
        res.redirect("/");
    }
};


router.get('/player', checkAuthentication, userController.loadPG);
router.post('/player/aggiungiPg', playerController.addPG);

router.post('/master/aggiungiParty', masterController.addParty);

router.get('/master', checkAuthentication, function(req, res, next) {
    res.render('master/masterhome');
});


module.exports = router;