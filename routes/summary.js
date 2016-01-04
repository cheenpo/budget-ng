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
  json["ignore"] = Array();
  json["macro"] = {};
  json["micro"] = {};
  json["warnings_transactional"] = Array();
  json["warnings_category"] = Array();
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  json["sql"] = "SELECT * FROM budget WHERE year="+json["year"]+" AND month="+json["month_number"]+" ORDER BY macro,micro";
  db.each(json["sql"], function(err, row) {
   if(row["ignore"] == 1) {
    json["ignore"].push(row);
   } else {
    var hash = row["hash"];
    var macro = row["macro"];
    var micro = row["macro"]+"."+row["micro"];
    var amount = row["amount"]
    // macro
    if(macro in json["macro"]) {
     json["macro"][macro] += amount;
    } else {
     json["macro"][macro] = amount;
    }
    // micro
    if(micro in json["micro"]) {
     json["micro"][micro] += amount;
    } else {
     json["micro"][micro] = amount;
    }
    // warnings.global - per transaction
    if(Math.abs(amount) > conf.global_warning_amount) {
     var message = {"hash": hash, "category": micro, "amount": amount, "limit": conf.global_warning_amount, "comparison": ">"};
     json["warnings_transactional"].push(message);
    }
   }
  }, function(err, rows) {
   // warnings.all - overall
   for(var micro in json["micro"]) {
    var amount = json["micro"][micro];
    for(var w=0; w < conf.warnings.length; w++) {
     if ( (micro == conf.warnings[w].category) && (Math.abs(amount) > conf.warnings[w].upper_limit) ) {
      var message = {"category": micro, "amount": amount, "limit": conf.warnings[w].upper_limit, "comparison": ">"};
      json["warnings_category"].push(message);
      break;
     }
    }
   }
   json["row_count"] = rows;
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
