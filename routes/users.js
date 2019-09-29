var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/player', function(req, res) {
    res.render('player/playerhome');
});

router.get('/master', function(req, res) {
    res.render('master/masterhome');
});
module.exports = router;