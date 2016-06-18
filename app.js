var mongoose = require('mongoose');
var express = require('express');
var db = require('./models/db');
var user = require('./models/user');
var week = require('./models/week');
var routes = require('./routes');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret:"kf56jllsk68l3lsd", resave:false, saveUninitialized:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

mongoose.connect('mongodb://localhost/veckans-mat', function(err, database) {
  if (err) return console.log('Failed connecting to database!');
  app.listen(8080, function() {
    console.log('listening on 8080')
  })
});



module.exports = app;
