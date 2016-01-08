var fs = require("fs");
var crypto = require('crypto');
var file = "db/budget.db";
var exists = fs.existsSync(file);

if(!exists) {
 console.log("[error] db file does not exist");
 process.exit(1);
}

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

var inserts = Array();
inserts.push({year: "2015", month: 2, day: 7, amount: 5000.00, description: "an amazing day", account: "my life", macro: "baby", micro: "born"});

for(var i=0; i < inserts.length; i++) {
 var insert = inserts[i];
 var to_hash = (insert.year+insert.month+insert.day+insert.description+insert.amount).replace(/ /g,"");
 var hash = crypto.createHash('md5').update(to_hash).digest('hex');
 console.log("[info] "+hash+" : "+to_hash+" : "+insert.macro+"."+insert.micro);
 db.run("INSERT OR IGNORE INTO budget (hash, year, month, day, amount, description, account, ignore, macro, micro) VALUES (?,?,?,?,?,?,?,?,?,?)", [hash, insert.year, insert.month, insert.day, insert.amount, insert.description, insert.account, 0, insert.macro, insert.micro]);
}
db.close();
