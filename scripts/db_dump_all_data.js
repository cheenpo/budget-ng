var fs = require("fs");
var file = "db/budget.db";
var exists = fs.existsSync(file);

if(!exists) {
 console.log("[error] db file does not exist");
 process.exit(1);
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
 db.each("SELECT * FROM budget", function(err, row) {
  console.log(row);
 });
});

db.close();
