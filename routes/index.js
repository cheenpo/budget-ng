var express = require("express");
var path = require('path');
var fs = require("fs");
var router = express.Router();
var file = path.join(__dirname, "../db/budget.db");
var exists = fs.existsSync(file);

// GET home page; default to transactions
router.get("/", function(req, res, next) {
 //res.send("cool beans!");
 res.redirect("/transactions");
});

router.get("/api", function(req, res, next) {
 res.send("cool beans!");
});

router.get("/api/months", function(req, res, next) {
 var json=Array();
 if(exists) {
  var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  var sql = "SELECT DISTINCT year,month FROM budget ORDER BY year desc, month desc";
  db.each(sql, function(err, row) {
   row["monthName"] = monthNames[row.month];
   json.push(row);
  }, function(err, rows) {
   res.send(json);
  });
 } else {
  res.send(json);
 }
});

module.exports = router;
