var mongoose = require('mongoose');
var express = require('express');
var Dish = require('../models/db');
var router = express.Router();
var newDish;

router.get('/', function(req, res) {
  Dish.find((function(err, result) {
  if (err) return console.log(err)
  console.log(result);
  res.render('index.pug', {dishes: result})
  }))
})


router.post('/dishes', function(req, res) {
  console.log(req.body)
  newDish = new Dish({
  'name': req.body.name,
  'found_at': req.body.found_at,
  'keywords': req.body.keywords.split(",")
  });
  newDish.save(function(err) {
  if (err) return console.log(err);
  console.log('saved to database');
  res.redirect('/');
  })
})

module.exports = router;



// var dishSchema = new Schema({
//   user: {type : Schema.Types.ObjectId, ref: 'User'},
//   name: String,
//   found_at: String,
//   keywords: [String]
// });
