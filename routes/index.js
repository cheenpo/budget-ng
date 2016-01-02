var express = require('express');
var router = express.Router();
//var fs = require('fs.extra');

// GET home page
router.get('/', function(req, res, next) {
 //res.send("cool beans!");
 res.render('index', { title: 'spacecowboy' });
});

// GET chuck norris fact
 //files = fs.readdirSync(dir);

module.exports = router;
