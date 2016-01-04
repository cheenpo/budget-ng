var express = require("express");
var path = require('path');
var fs = require("fs");
var router = express.Router();
var file = path.join(__dirname, "../db/budget.db");
var exists = fs.existsSync(file);


router.get("/", function(req, res, next) {
 var json = req.query;
 var currentDate = new Date();
 var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 if (json["year"] == undefined) { json["year"] = currentDate.getFullYear(); }
 if (json["month"] == undefined) { json["month"] = currentDate.getMonth()+1; }
 if (json["hash"] == undefined) { json["hash"] = "%"; }
 if (json["category"] == undefined) {
  json["macro"] = "%";
  json["micro"] = "%";
 } else {
  json["macro"] = json["category"].split(".")[0];
  json["micro"] = json["category"].split(".")[1];
 }
 json["month_number"] = json["month"];
 json["month"] = monthNames[json["month"]];
 if(exists) {
  json["db_code"] = 0;
  json["total"] = 0;
  json["transactions"] = Array();
  //
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  if (json["hash"] == "%") {
   json["sql"] = "SELECT * FROM budget WHERE year="+json["year"]+" AND month="+json["month_number"]+" AND hash like '%"+json["hash"]+"%' AND macro like '%"+json["macro"]+"%' AND micro like '%"+json["micro"]+"%' ORDER BY year,month,day desc";
  } else {
   json["sql"] = "SELECT * FROM budget WHERE hash like '%"+json["hash"]+"%' ORDER BY year,month,day desc";
  }
  db.each(json["sql"], function(err, row) {
   if(row.ignore) {
    row["ignore_class"] = "warning";
   } else {
    row["ignore_class"] = "";
   }
   json["transactions"].push(row);
   json["year"] = row.year;
   json["month_number"] = row.month;
   json["month"] = monthNames[row.month];
   json["total"] += row.amount;
  }, function(err, rows) {
   json["row_count"] = rows;
   res.render("transactions", { title: "budget-ng :: transactions", data: json });
  });
  db.close();
  //
 } else {
  json["db_code"] = 1;
  res.render("transactions", { title: "budget-ng :: transactions", data: json });
 }
});

router.get("/api", function(req, res, next) {
 var json = req.query;
 var currentDate = new Date();
 var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 if (json["year"] == undefined) { json["year"] = currentDate.getFullYear(); }
 if (json["month"] == undefined) { json["month"] = currentDate.getMonth()+1; }
 if (json["hash"] == undefined) { json["hash"] = "%"; }
 if (json["category"] == undefined) {
  json["macro"] = "%";
  json["micro"] = "%";
 } else {
  json["macro"] = json["category"].split(".")[0];
  json["micro"] = json["category"].split(".")[1];
 }
 json["month_number"] = json["month"];
 json["month"] = monthNames[json["month"]];
 if(exists) {
  json["db_code"] = 0;
  json["total"] = 0;
  json["transactions"] = Array();
  //
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  if (json["hash"] == "%") {
   json["sql"] = "SELECT * FROM budget WHERE year="+json["year"]+" AND month="+json["month_number"]+" AND hash like '%"+json["hash"]+"%' AND macro like '%"+json["macro"]+"%' AND micro like '%"+json["micro"]+"%' ORDER BY year,month,day desc";
  } else {
   json["sql"] = "SELECT * FROM budget WHERE hash like '%"+json["hash"]+"%' ORDER BY year,month,day desc";
  }
  db.each(json["sql"], function(err, row) {
   json["transactions"].push(row);
   json["year"] = row.year;
   json["month_number"] = row.month;
   json["month"] = monthNames[row.month];
   json["total"] += row.amount;
  }, function(err, rows) {
   json["row_count"] = rows;
   res.send(json);
  });
  db.close();
  //
 } else {
  json["db_code"] = 1;
  res.send(json);
 }
});

router.put("/api", function(req, res, next) {
 var json = req.query;
 if (json["hash"] == undefined) { json["hash"] = "%"; }
 if(exists && json["hash"] != "%") {
  json["db_code"] = 0;
  //
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  json["sql"] = "UPDATE budget SET ignore="+json["ignore"]+" WHERE hash='"+json["hash"]+"'";
  db.run(json["sql"]);
  db.close();
  res.send(json);
  //
 } else {
  json["db_code"] = 1;
  res.send(json);
 }
});

module.exports = router;
