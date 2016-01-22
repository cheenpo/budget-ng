var fs = require("fs");
var file = "db/budget.db";
var exists = fs.existsSync(file);
var arg = process.argv[2];

if(!exists) {
 console.log("[error] db file does not exist");
 process.exit(1);
}
if(!arg) {
 console.log("[error] pass in year-month argument (ex: 2015-12)");
 process.exit(1);
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

var yearmonth = arg.split("-")
db.run("DELETE FROM budget WHERE year="+yearmonth[0]+" and month="+yearmonth[1]);

db.close();
