var express = require("express");
var app = express();
var favicon = require('serve-favicon');
var path = require('path');
var logger = require('morgan');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// custom x-powered-by
app.use(function (req, res, next) {
 res.header("x-powered-by", "cheenpo");
 next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var routes = require('./routes/index');

app.use(logger('common'));
app.use('/', routes);

var port = 8080;
var server = app.listen(port, function () {
  console.log("listening on port: "+port);
});
