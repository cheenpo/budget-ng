var express = require("express");
var path = require("path");
var fs = require("fs");
var multer  = require("multer");
var parse = require("csv-parse");
var crypto = require("crypto");
var yaml = require("js-yaml");

var router = express.Router();
var file = path.join(__dirname, "../db/budget.db");
var exists = fs.existsSync(file);
var conf_file = path.join(__dirname, "../conf/rules.yml");
var conf_file_exists = fs.existsSync(conf_file);

var storage = multer.diskStorage({
 destination: function (req, file, callback) {
  callback(null, './uploads');
 },
 filename: function (req, file, callback) {
  callback(null, file.fieldname + '-' + Date.now());
 }
});
var upload = multer({ storage : storage}).single("ingestFile");


// file input
router.get("/", function(req, res, next) {
 var json = {file: "", code: 0, message: ""};
 res.render("upload", { title: "budget-ng :: upload", data: json });
});


// actual upload
router.post("/", function(req,res) {
 var waiting = 0;

 function finishPost(json) {
  if(waiting == 0) {
   // clean up file
   if(req.file.path) {
    fs.unlinkSync(path.join(__dirname, "../"+req.file.path));
   }
   //
   res.render("upload", { title: "budget-ng :: upload", data: json });
  }
 }

 upload(req,res,function(err) {
  var json = {file: "", code: 2, message: ""};
  if(err) {
   json["code"] =  1;
   json["message"] = "error: "+err;
   finishPost(json);
  } else if (!req.file) {
   json["code"] =  1;
   json["message"] = "something went wrong with the upload... oO";
   finishPost(json);
  } else if(!exists) {
   json["code"] =  1;
   json["message"] = "db file does not exist... oO";
   finishPost(json);
  } else if(!conf_file_exists) {
   json["code"] =  1;
   json["message"] = "conf file does not exist... oO";
   finishPost(json);
  } else {
   json["code"] =  0;
   json["file_detail"] = req.file;

   // ingest logic
   var conf = yaml.load(fs.readFileSync(conf_file));
   var sqlite3 = require("sqlite3").verbose();
   var db = new sqlite3.Database(file);

   json["entries"] = Array();
   json["duplicates"] = Array();
   json["issues"] = Array();

   fs.readFile(path.join(__dirname, "../"+req.file.path), 'utf8', function (err, data) {
    if (err) {
     json["code"] =  1;
     json["message"] = "error: "+err;
    } else {
     var lines = data.split("\n");
     for(var i=1; i < lines.length; i++) {
      if(lines[i] == "") { continue; }
      waiting++;
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
        //console.log("[error] unable to categorize: \n"+row);
        json["issues"].push({hash: to_hash, macro: macro, micro: micro, amount: amount_to_insert, description: description, account: account});
       }
       //
       db.all("SELECT * FROM budget WHERE hash = '"+hash+"'", function(err, row) {
        if(row.length > 0) {
         //console.log("[warn] duplicate data: "+row[0]["description"]+" waiting: "+waiting);
         json["duplicates"].push({hash: to_hash, macro: macro, micro: micro, amount: amount_to_insert, description: description, account: account});
        } else {
         if( (conf.status_to_analyze == status) && (macro != "unknown") ) {
          //console.log("[info] "+hash+" : "+to_hash+" : "+macro+"."+micro);
          json["entries"].push({hash: to_hash, macro: macro, micro: micro, amount: amount_to_insert, description: description, account: account});
          db.run("INSERT OR IGNORE INTO budget (hash, year, month, day, amount, description, account, ignore, macro, micro) VALUES (?,?,?,?,?,?,?,?,?,?)", [hash, year, month, day, amount_to_insert, description, account, 0, macro, micro]);
         }
        }
        waiting--;
        json["message"] = "uploaded "+req.file.originalname+" successfully!";
        finishPost(json);
       });
      }); // end of parse on csv line
     } // end of file for loop
    } // end of if-else on readFile
   }); // end of file read
  } // end of if-else if-else
 });
});


module.exports = router;
