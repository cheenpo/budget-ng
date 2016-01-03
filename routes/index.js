var express = require("express");
var router = express.Router();

// GET home page; default to transactions
router.get("/", function(req, res, next) {
 //res.send("cool beans!");
 res.redirect("/transactions");
});

module.exports = router;
