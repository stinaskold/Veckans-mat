var mongoose = require('mongoose');
var express = require('express');
var bcrypt = require('bcrypt');
var Dish = require('../models/db');
var Week = require('../models/week');
var Menu = require('../models/menu');
var User = require('../models/user');
var app = require('../app.js');
var router = express.Router();
var newDish;
var Weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];


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
  //   {$group: {"_id": "$keywords"(null), "keywords":{"$addToSet": "$keywords"}}},
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
  // var keywords = req.body.keywords.split();
  // var keywordsArray = [];
  // for var i = 0, i < keywords.length; i++ {
  //   keywordsArray.push(keywords[i]);
  // }
  newDish = new Dish({
  'user': req.session.user._id,
  'name': req.body.name,
  'found_at': req.body.found_at,
  'keywords': req.body.keywords.split(", ")
  });
  newDish.save(function(err) {
  if (err) return console.log(err);
  console.log('saved to database');
  res.redirect('/logged-in');
  })
})

router.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  var newUser = new User();
  newUser.username = username;
  newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(9));
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

  User.findOne({username: username}, function(err,user) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }
    if(!user) {
      return res.status(404).send();
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      console.log('Du är inloggad.');
      res.redirect('/logged-in');
      return res.status(200).send();
    }
    console.log("Fel lösenord!");
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
    console.log('Du har inte loggat in!');
    return res.status(401).send();
  }
  Dish.distinct("keywords", (function(err, result) {
  if (err) return console.log(err)
  console.log(result);
  res.render('logged-in.pug', {keywords: result})
  }))
  console.log('Välkommen till den inloggade sidan');
});

router.post('/week', function(req, res) {
  Week.remove({}, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            } else {
                console.log('Removed old week');
            }
        }
    );

  /*var Monday = req.body.Monday;
  var Tuesday = req.body.Tuesday;
  var Wednesday = req.body.Wednesday;
  var Thursday = req.body.Thursday;
  var Friday = req.body.Friday;
  var Saturday = req.body.Saturday;
  var Sunday = req.body.Sunday;

  var newWeek = new Week();
  newWeek.Monday = Monday;
  newWeek.Tuesday = Tuesday;
  newWeek.Wednesday = Wednesday;
  newWeek.Thursday = Thursday;
  newWeek.Friday = Friday;
  newWeek.Saturday = Saturday;
  newWeek.Sunday = Sunday;*/
  var newWeek = new Week();
  newWeek.user = req.session.user._id;
  for (var i = 0; i < Weekdays.length; i++) {
    newWeek[Weekdays[i]] = req.body[Weekdays[i]];
  }

  newWeek.save(function(err) {
    if (err) return console.log(err);
    console.log('saved to database');
    res.redirect('/logged-in');
  })
});

router.get('/generate-menu', function(req, res) {
  Menu.remove({}, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            } else {
                console.log('Removed old menu');
            }
        }
    );

  Week.find({}, function(err, result) {
    if (err) return console.log(err)
    console.log('result from week: ' + result[0]);
    console.log('result[0].Monday ' + result[0].Monday);
    //var Monday = result[0].Monday;
    //var Tuesday = result[0].Tuesday;
    //var newMenu = new Menu();
    //console.log('result from function' + getWeekday(Monday));


    /*saveWeekday("Monday", result[0]);
    saveWeekday("Tuesday", result[0]);
    saveWeekday("Wednesday", result[0]);
    saveWeekday("Thursday", result[0]);
    saveWeekday("Friday", result[0]);
    saveWeekday("Saturday", result[0]);
    saveWeekday("Sunday", result[0]);*/
    var newMenu = new Menu();
    newMenu.user = req.session.user._id;
    newMenu.save(function(err) {
      if (err) return console.log(err);
      console.log('saved to database');
    });
    for (var i = 0; i < Weekdays.length; i++) {
      //console.log(req.session.user._id);
      saveWeekday(newMenu, Weekdays[i], result[0]);
    }

    res.redirect('/logged-in');
        // Dish.aggregate([{$match:{keywords:{$all: result[0].weekday}}},{$sample: { size: 1 }}], function(err, result2) {
        //   console.log(result2);
        //   console.log(result2[0]._id);
        //   var dishID = result2[0]._id;
        //   var newMenu = new Menu();
        //   newMenu.weekday = dishID;
        //   newMenu.save(function(err) {
        //     if (err) return console.log(err);
        //     console.log('saved to database');
        //     res.redirect('/logged-in');
        //   });
        // });

    // Dish.aggregate([{$match:{keywords:{$all:result[0].Monday}}},{$sample: { size: 1 }}], function(err, result2) {
    //   console.log(result2);
    //   console.log(result2[0]._id);
    //   var dishID = result2[0]._id;
    //   var newMenu = new Menu();
    //   newMenu.Monday = dishID;
    //   newMenu.save(function(err) {
    //     if (err) return console.log(err);
    //     console.log('saved to database');
    //     res.redirect('/logged-in');
    //   });
    // });
  });

});

// function saveWeekday(weekday) {
//   Dish.aggregate([{$match:{keywords:{$all: weekday}}},{$sample: { size: 1 }}], function(err, result2) {
//     var dishID;
//     console.log('result from random dish ' + result2[0]);
//     console.log(result2[0]._id);
//     dishID = result2[0]._id;
//     console.log('dishID is ' + dishID);
//     var newMenu = new Menu();
//     newMenu.Monday = dishID;
//     newMenu.save(function(err) {
//       if (err) return console.log(err);
//       console.log('saved to database');
//     });
//   });
//   //return dishID;
// }

function saveWeekday(newMenu, weekday, result, user) {
  console.log('user i funktionen: ' + user);
  var dishID;
  if (result[weekday] != "") {
    Dish.aggregate([{$match:{user: newMenu.user, keywords:{$all: result[weekday]}}},{$sample: { size: 1 }}], function(err, result2) {
      dishID = result2[0]._id;
      console.log('dishID is ' + dishID);
      newMenu[weekday] = dishID;
      newMenu.save(function(err) {
        if (err) return console.log(err);
        console.log('saved to database');
      });
    });
  } else {
    Dish.aggregate([{$match:{user: newMenu.user}},{$sample: { size: 1 }}], function (err, result2) {
      dishID = result2[0]._id;
      console.log('dishID is ' + dishID);
      newMenu[weekday] = dishID;
      newMenu.save(function(err) {
        if (err) return console.log(err);
        console.log('saved to database');
      });
    });
  }
}


router.get('/logout', function(req, res) {
  req.session.destroy();
  console.log('Du är nu utloggad.');
  return res.status(200).send();
});


module.exports = router;
