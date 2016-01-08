var fs = require("fs");
var yaml = require("js-yaml");
var file = "db/budget.db";
var exists = fs.existsSync(file);
var conf_file = "conf/rules.yml"
var conf_file_exists = fs.existsSync(conf_file);

if(!exists) {
 console.log("[error] db file does not exist");
 console.log("[info] run node scripts/db_create.js");
 process.exit(1);
}
if(!conf_file_exists) {
 console.log("[error] "+conf_file+" file does not exist");
 console.log("[info] create one from a copy in conf/rules.yml.example");
 process.exit(1);
}

var conf = yaml.load(fs.readFileSync(conf_file));

if(!conf) {
 console.log("[error] "+conf_file+" file is not valid yaml   oO");
 console.log("[info] compare against conf/rules.yml.example and/or google around");
 process.exit(1);
}

