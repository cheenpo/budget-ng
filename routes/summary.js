var express = require("express");
var yaml = require("js-yaml");
var path = require('path');
var fs = require("fs");
var router = express.Router();
var file = path.join(__dirname, "../db/budget.db");
var exists = fs.existsSync(file);
var conf_file = path.join(__dirname, "../conf/rules.yml");
var conf_file_exists = fs.existsSync(conf_file);


router.get("/", function(req, res, next) {
 var json = req.query;
 var currentDate = new Date();
 var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 if (json["year"] == undefined) { json["year"] = currentDate.getFullYear(); }
 if (json["month"] == undefined) { json["month"] = currentDate.getMonth()+1; }
 json["month_number"] = json["month"];
 json["month"] = monthNames[json["month"]];
 if(exists && conf_file_exists) {
  json["db_code"] = 0;
  json["conf_code"] = 0;
  //
  var conf = yaml.load(fs.readFileSync(conf_file));
  json["categories"] = Array();
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  json["sql"] = "SELECT * FROM budget WHERE year="+json["year"]+" AND month="+json["month_number"];
  db.each(json["sql"], function(err, row) {
   // calculate stuff
  }, function(err, rows) {
   res.render("summary", { title: "budget-ng :: summary", data: json });
  });
  db.close();
  //
 } else {
  if(!exists) { json["db_code"] = 1; }
  if(!conf_file_exists) { json["conf_code"] = 1; }
  res.render("summary", { title: "budget-ng :: summary", data: json });
 }
});

module.exports = router;