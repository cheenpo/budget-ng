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
 var json = {};
 var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 if(exists && conf_file_exists) {
  json["db_code"] = 0;
  json["conf_code"] = 0;
  json["total"] = 0;
  //
  var conf = yaml.load(fs.readFileSync(conf_file));
  json["positive"] = Array();
  json["negative"] = Array();
  json["total"] = Array();
  json["percentage_saved"] = Array();
  json["macro"] = Array();
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  json["sql"] = "SELECT * FROM budget ORDER BY year asc,month asc,day asc";
  var last_date="";
  var entry = {"positive": 0, "negative": 0, "total": 0, "percentage_saved": 0, "macro": {}};
  db.each(json["sql"], function(err, row) {
   // var date = row["year"]+"-"+monthNames[row["month"]]; // month name messes up linking   :/
   var date = row["year"]+"-"+row["month"];
   var macro = row["macro"];
   var micro = row["macro"]+"."+row["micro"];
   var amount = row["amount"];
   //
   if(date != last_date) {
    // make sure macro.income != 0
    if(entry["macro"]["income"] == 0) {
     entry["macro"]["income"] = 1;
    }
    json["positive"].push([last_date, entry["positive"]]);
    json["negative"].push([last_date, entry["negative"]]);
    json["total"].push([last_date, entry["total"]]);
    json["percentage_saved"].push([last_date, Math.round((entry["total"] / entry["macro"]["income"])*10000)/100]);
    json["macro"].push([last_date, entry["macro"]]);
    entry = {"positive": 0, "negative": 0, "total": 0, "percentage_saved": 0, "macro": {}};
   }
   var positive = 0;
   var negative = 0;
   if(amount >= 0) {
    positive = amount;
   } else {
    negative = amount;
   }
   if(row["ignore"] == 0) {
    entry["positive"] += positive;
    entry["negative"] += negative;
    entry["total"] += amount;
    if(macro in entry["macro"]) {
     entry["macro"][macro] += amount;
    } else {
     entry["macro"][macro] = amount;
    }
   }
   last_date = date;
  }, function(err, rows) {
   json["row_count"] = rows;
   // push last entry hash (since nothing triggers that)
   // make sure macro.income != 0
   if(entry["macro"]["income"] == 0) {
    entry["macro"]["income"] = 1;
   }
   json["positive"].push({label: last_date, date: entry["positive"]});
   json["negative"].push([last_date, entry["negative"]]);
   json["total"].push([last_date, entry["total"]]);
   json["percentage_saved"].push([last_date, Math.round((entry["total"] / entry["macro"]["income"])*10000)/100]);
   json["macro"].push([last_date, entry["macro"]]);
   // shift off that silly first entry
   json["positive"].shift();
   json["negative"].shift();
   json["total"].shift();
   json["percentage_saved"].shift();
   json["macro"].shift();
   // pop off the last entry since it is in progress
   json["positive"].pop();
   json["negative"].pop();
   json["total"].pop();
   json["percentage_saved"].pop();
   json["macro"].pop();
   // calculate average total
   var total_sum = 0;
   for(var i=0; i < json["total"].length; i++) {
    total_sum += json["total"][i][1];
   }
   json["average_total"] = total_sum / json["total"].length;
   // calculate average percentage_saved
   var percentage_saved_sum = 0;
   for(var i=0; i < json["percentage_saved"].length; i++) {
    percentage_saved_sum += json["percentage_saved"][i][1];
   }
   json["average_percentage_saved"] = Math.round(percentage_saved_sum / json["percentage_saved"].length);
   //
   res.render("trends", { title: "budget-ng :: trends", data: json });
  });
  db.close();
  //
 } else {
  if(!exists) { json["db_code"] = 1; }
  if(!conf_file_exists) { json["conf_code"] = 1; }
  res.render("trends", { title: "budget-ng :: trends", data: json });
 }
});

module.exports = router;
