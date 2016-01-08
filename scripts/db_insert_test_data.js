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
 var stmt = db.prepare("INSERT OR IGNORE INTO budget VALUES (?,?,?,?,?,?,?,?,?,?)");
 stmt.run('test1', 2015, 12, 01, 40.01, 'anything', 'amex', 0, 'food', 'groceries');
 stmt.run('test2', 2015, 12, 01, 40.02, 'anything', 'amex', 0, 'food', 'groceries');
 stmt.finalize();
});

db.close();
