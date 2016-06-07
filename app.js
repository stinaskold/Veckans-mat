var mongoose = require('mongoose');
var express = require('express');
var db = require('./models/db');
var db = require('./models/user');
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

// app.get('/', function(req, res) {
//   Message.find((function(err, result) {
//   if (err) return console.log(err)
//   res.render('index.jade', {messages: result})
// })).sort({time: -1})
// })
//
// app.post('/messages', function(req, res) {
//
//   console.log(req.body)
//   newMessage = new Message({
//   'user': req.body.user,
//   'message': req.body.message
//   });
//   newMessage.save(function(err) {
//   if (err) return console.log(err);
//   console.log('saved to database');
//   res.redirect('/');
//   })
// })

module.exports = app;
