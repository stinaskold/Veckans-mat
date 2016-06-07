var mongoose = require('mongoose');
var express = require('express');
var Dish = require('../models/db');
var User = require('../models/user');
var app = require('../app.js');
var router = express.Router();
var newDish;

router.get('/', function(req, res) {
  Dish.find((function(err, result) {
  if (err) return console.log(err)
  res.render('index.pug', {dishes: result})
  }))
})

// Dish.find(function(err, result) {
// if (err) return console.log(err)
// console.log(result);
// //res.render('index.pug', {dishes: result})
// });


  // Dish.aggregate([
  //   {$project: { _id: 0, keywords: 1 }},
  //   {$unwind: "$keywords" },
  //   {$group: {"_id": "$keywords", "keywords":{"$addToSet": "$keywords"}}},
  //   {$unwind: "$keywords" },
  //   {$group: {"_id": "$keywords", count: {$sum: 1}}},
  //   {$project: { _id: 0, keywords: "$_id" }}
  // ], function(err, result) {
  // if (err) return console.log(err)
  // console.log('%j',result);
  //
  // //res.render('index.pug', {dishes: result})
  // });



router.post('/dishes', function(req, res) {
  console.log("Nu går jag!");
  console.log(req.body);
  //var keywords = req.body.keywords.split(",");
  newDish = new Dish({
  'name': req.body.name,
  'found_at': req.body.found_at,
  'keywords': req.body.keywords.split()
  });
  newDish.save(function(err) {
  if (err) return console.log(err);
  console.log('saved to database');
  res.redirect('/');
  })
})

router.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  var newUser = new User();
  newUser.username = username;
  newUser.password = password;
  newUser.firstname = firstname;
  newUser.lastname = lastname;

  newUser.save(function(err, savedUser) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }
    console.log('saved to database');
    return res.status(200).send();
  })
});

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username, password: password}, function(err,user) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }
    if(!user) {
      return res.status(404).send();
    }
    req.session.user = user;
    console.log('Du är inloggad.');
    return res.status(200).send();
  })
  //
  // User.findOne({username:username}, function(err, user) {
  //   if(err) {
  //     console.log(err);
  //     return res.status(500).send();
  //   }
  //   if(!user) {
  //     console.log('Kan inte hitta användare')
  //     return res.status(404).send();
  //   }
  //
  //   user.comparePassword(password, function(err, isMatch) {
  //     if (isMatch && isMatch == true) {
  //       //console.log('inloggad');
  //       req.session.user = user;
  //       //res.render('logged-in.pug');
  //       return res.status(200).send();
  //     } else {
  //       return res.status(401).send();
  //     }
  //   });
  // })
});

router.get('/logged-in', function(req, res) {
  if(!req.session.user) {
    console.log('Du har inte loggat in!')
    return res.status(401).send()
  }
  console.log('Välkommen till den inloggade sidan')
  return res.status(200).send("Welcome to super-secret API")
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  console.log('Du är nu utloggad.');
  return res.status(200).send();
});


module.exports = router;
