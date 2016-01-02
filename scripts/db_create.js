var fs = require("fs");
var file = "db/budget.db";
var exists = fs.existsSync(file);

if(!exists) {
 console.log("[info] creating db file.");
 fs.openSync(file, "w");
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
 if(!exists) {
  db.run("CREATE TABLE budget(hash TEXT primary key not null, year INTEGER, month INTEGER, day INTEGER, amount DECIMAL(20,2), description TEXT, account TEXT, ignore BOOLEAN, macro TEXT, micro TEXT )");
 } else {
  console.log("[info] db file already exists");
 }

});

db.close();