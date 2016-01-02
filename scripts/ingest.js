var fs = require("fs");
var file = "db/budget.db";
var exists = fs.existsSync(file);
var ingest_file = process.argv[2];
var ingest_file_exists = fs.existsSync(ingest_file);

if(!exists) {
 console.log("[error] db file does not exist");
 process.exit(1);
}
if(!ingest_file_exists) {
 console.log("[error] ingest_file file does not exist");
 process.exit(1);
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
 //var stmt = db.prepare("INSERT OR IGNORE INTO budget VALUES (?,?,?,?,?,?,?,?,?,?)");
 fs.readFile(ingest_file, 'utf8', function (err, data) {
  if (err) throw err;
  var lines = data.split("\n");
  for(var i=0; i < lines.length; i++) {
   console.log("i: "+i+" => "+lines[i]);
  }
 });
 //stmt.run('1', 2015, 12, 01, 40.01, 'anything', 'amex', 0, 'food', 'groceries');
 //stmt.finalize();
});

db.close();
