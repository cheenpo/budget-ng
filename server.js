var express = require("express");
var favicon = require('serve-favicon');
var path = require('path');
var logger = require('morgan');

var app = express();

var index = require('./routes/index');
var transactions = require('./routes/transactions');
var summary = require('./routes/summary');
var trends = require('./routes/trends');

app.use(logger('common'));
app.use('/', index);
app.use('/transactions', transactions);
app.use('/summary', summary);
app.use('/trends', trends);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// custom x-powered-by
app.use(function (req, res, next) {
 res.header("x-powered-by", "cheenpo");
 next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.locals.formatAmountStyle = function(amount) {
 var color = "";
 if(amount > 0) {
  color = "53D769";
 } else {
  color = "FC3D39";
 }
 return "text-align: right; position:relative; right:5px; color: #"+color;
}
app.locals.formatAmount = function(amount) {
 return "$"+Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var port = 80;
var server = app.listen(port, function () {
  console.log("listening on port: "+port);
});
