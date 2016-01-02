var fs = require("fs");
var file = "db/budget.db";
var exists = fs.existsSync(file);
var hash = process.argv[2];

if(!exists) {
 console.log("[error] db file does not exist");
 process.exit(1);
}
if(!hash) {
 console.log("[error] pass in hash as argument");
 process.exit(1);
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
 db.each("SELECT * FROM budget WHERE hash='0fbeb3f3c876f55fdcf3e4962b2e4815'", function(err, row) {
  console.log(row);
 });
});

db.close();
