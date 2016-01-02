var fs = require("fs");
var parse = require('csv-parse');
var crypto = require('crypto');
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

fs.readFile(ingest_file, 'utf8', function (err, data) {
 if (err) throw err;
 var lines = data.split("\n");
 for(var i=1; i < lines.length; i++) {
  if(lines[i] == "") { continue; }
  parse(lines[i], function(err, row) {
  	//console.log(row);
   var status = row[0][0];
   var date = row[0][1];
   var description = row[0][2];
   var amount = row[0][6];
   var account = row[0][10];
   /*
   var positive = true;
   if (amount.indexOf("-") !=-1) {
    positive = false;
   }
   */
   // clean amount
   amount = amount.replace("\"", "");
   amount = amount.replace(",", "");
   var amount_to_insert = amount;
   amount = amount.replace("-", "");
   // date details
   var date_details = date.split("/");
   var year = date_details[2];
   var month = date_details[0];
   var day = date_details[1];
   var to_hash = (year+month+day+description+amount).replace(/ /g,"");
   var hash = crypto.createHash('md5').update(to_hash).digest('hex');
   //console.log(hash+" : "+to_hash);
   var insert = false;
   db.all("SELECT * FROM budget WHERE hash = '"+hash+"'", function(err, row) {
   	if(row.length > 0) {
   	 console.log("[warn] duplicate data: "+row[0]["description"]);
   	}
   });
   db.run("INSERT OR IGNORE INTO budget (hash, year, month, day, amount, description, account, ignore, macro, micro) VALUES (?,?,?,?,?,?,?,?,?,?)", [hash, year, month, day, amount_to_insert, description, account, 0, 'to', 'do']);
  });
 }
});
