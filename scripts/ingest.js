var fs = require("fs");
var parse = require('csv-parse');
var crypto = require('crypto');
var yaml = require("js-yaml");
var file = "db/budget.db";
var exists = fs.existsSync(file);
var ingest_file = process.argv[2];
var ingest_file_exists = fs.existsSync(ingest_file);
var conf_file = process.argv[3];
var conf_file_exists = fs.existsSync(conf_file);

if(!exists) {
 console.log("[error] db file does not exist");
 process.exit(1);
}
if(!ingest_file_exists) {
 console.log("[error] ingest_file file does not exist");
 process.exit(1);
}
if(!conf_file_exists) {
 console.log("[error] conf_file file does not exist");
 process.exit(1);
}

var conf = yaml.load(fs.readFileSync(conf_file));

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
   // categorize based on yaml rules
   //// halt if something fails... ensures that everything gets categorized
   var macro = "unknown";
   var micro = "unknown";
   for(var c=0; c < conf.categories.length; c++) {
    if (description.indexOf(conf.categories[c].match) !=-1) {
     macro = conf.categories[c].macro;
     micro = conf.categories[c].micro;
     break;
    }
   }
   if(macro == "unknown") {
    console.log("[error] unable to categorize: \n"+row);
    process.exit(1);
   }
   //
   db.all("SELECT * FROM budget WHERE hash = '"+hash+"'", function(err, row) {
   	if(row.length > 0) {
   	 console.log("[warn] duplicate data: "+row[0]["description"]);
   	}
   });
   if(conf.status_to_analyze == status) {
    console.log("[info] "+hash+" : "+to_hash+" : "+macro+"."+micro);
    db.run("INSERT OR IGNORE INTO budget (hash, year, month, day, amount, description, account, ignore, macro, micro) VALUES (?,?,?,?,?,?,?,?,?,?)", [hash, year, month, day, amount_to_insert, description, account, 0, macro, micro]);
   }
  });
 }
});
