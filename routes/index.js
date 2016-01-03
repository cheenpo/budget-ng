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

router.get("/transactions", function(req, res, next) {
 var json = req.query;
 var currentDate = new Date();
 var monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
 if (json["year"] == undefined) { json["year"] = currentDate.getFullYear(); }
 if (json["month"] == undefined) { json["month"] = currentDate.getMonth()+1; }
 if (json["hash"] == undefined) { json["hash"] = "%"; }
 if (json["macro"] == undefined) { json["macro"] = "%"; }
 if (json["micro"] == undefined) { json["micro"] = "%"; }
 json["month_number"] = json["month"];
 json["month"] = monthNames[json["month"]];
 if(exists) {
  json["db_code"] = 0;
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
  }, function(err, rows) {
   res.render("transactions", { title: "budget-ng :: transactions", data: json });
  });
  db.close();
  //
 } else {
  json["db_code"] = 1;
  res.render("transactions", { title: "budget-ng :: transactions", data: json });
 }
});

// GET chuck norris fact
 //files = fs.readdirSync(dir);

module.exports = router;
