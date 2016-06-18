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

// Funktion för att slumpa fram en maträtt för en specifik veckodag
function saveWeekday(newMenu, weekday, result, user) {
  var dishID;
  // Om sökord finns, slumpa fram en maträtt med dessa sökord
  if (result[weekday] != "") {
    Dish.aggregate([{$match:{user: newMenu.user, keywords:{$all: result[weekday]}}},{$sample: { size: 1 }}], function(err, result2) {
      dishID = result2[0]._id;
      newMenu[weekday] = dishID;
      newMenu.save(function(err) {
        if (err) return console.log(err);
        console.log('saved to database');
      });
    });
  // Om inga sökord finns, slumpa bland alla maträtter som användaren har lagt till
  } else {
    Dish.aggregate([{$match:{user: newMenu.user}},{$sample: { size: 1 }}], function (err, result2) {
      dishID = result2[0]._id;
      newMenu[weekday] = dishID;
      newMenu.save(function(err) {
        if (err) return console.log(err);
        console.log('saved to database');
      });
    });
  }
}

/* GET home page. */
router.get('/', function(req, res) {
  Dish.find((function(err, result) {
  if (err) return console.log(err)
  res.render('index.pug', {dishes: result})
  }))
})

/* GET logga-in  */
router.get('/logga-in', function(req, res, next) {
  res.render('logga-in', { title: 'Veckans mat' });
});

/* GET logga ut */
router.get('/logga-ut', function(req, res, next) {
  if(!req.session.user) {
    console.log('Du har inte loggat in!');
    res.redirect('/inte-inloggad');
  }
  res.render('logga-ut', { title: 'Veckans mat' });
});

/* GET logga-in  */
router.get('/inte-inloggad', function(req, res, next) {
  res.render('meddelande', { title: 'Veckans mat', message: 'Du är inte inloggad!' });
});

/* GET registrerad  */
router.get('/registrerad', function(req, res, next) {
  res.render('meddelande', { title: 'Veckans mat', message: 'Du är nu registrerad!' });
});

/* GET finns-inte  */
router.get('/finns-inte', function(req, res, next) {
  res.render('meddelande', { title: 'Veckans mat', message: 'Användaren finns inte.' });
});

/* GET finns-redan  */
router.get('/finns-redan', function(req, res, next) {
  res.render('meddelande', { title: 'Veckans mat', message: 'Användaren finns redan!' });
});

/* GET fel-losen  */
router.get('/fel-losen', function(req, res, next) {
  res.render('meddelande', { title: 'Veckans mat', message: 'Du har angett fel lösenord.' });
});

/* GET ingen-anvandare  */
router.get('/ingen-anvandare', function(req, res, next) {
  res.render('meddelande', { title: 'Veckans mat', message: 'Du har inte angett något användarnamn!' });
});


/* GET spara maträtt */
router.get('/spara-matratt', function(req, res, next) {
  if(!req.session.user) {
    console.log('Du har inte loggat in!');
    res.redirect('/inte-inloggad');
  }
  Dish.find({user: req.session.user._id}, function(err, result) {
    res.render('spara-matratt', { dishes: result });
  }).sort({ $natural: -1 }).limit(1);
});

/* GET spara sökord */
router.get('/spara-sokord', function(req, res, next) {
  if(!req.session.user) {
    console.log('Du har inte loggat in!');
    res.redirect('/inte-inloggad');
  }
  Dish.distinct('keywords', (function(err, result) {
  if (err) return console.log(err)
  console.log(result);
  res.render('spara-sokord', {keywords: result})
  }))
});

/* GET sökord sparade */
router.get('/sokord-sparade', function(req, res, next) {
  if(!req.session.user) {
    console.log('Du har inte loggat in!');
    res.redirect('/inte-inloggad');
  }
  Week.find({user: req.session.user._id}, (function(err, result) {
  if (err) return console.log(err)
  console.log(result);
  res.render('sokord-sparade', {weekdays: result})
  }))
});

/* GET slumpa-matsedel */
router.get('/slumpa-matsedel', function(req, res, next) {
  if(!req.session.user) {
    console.log('Du har inte loggat in!');
    res.redirect('/inte-inloggad');
  }

  Menu.find({user: req.session.user._id}).populate(Weekdays).exec(function(err, result) {
    res.render('slumpa-matsedel', {weekdays: result[0]});
  });
});



// Spara ny maträtt
router.post('/dishes', function(req, res) {
  console.log(req.body);

  newDish = new Dish({
  'user': req.session.user._id,
  'name': req.body.name,
  'found_at': req.body.found_at,
  'keywords': req.body.keywords.toLowerCase().split(", ")
  });
  newDish.save(function(err) {
    if (err) {
    return console.log(err);
    }
    console.log('saved to database');
    res.redirect('/spara-matratt');
  })
})

//Registrera ny användare
router.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;

  if(username === "") {
    res.redirect('/ingen-anvandare');
    return;
  }

  var newUser = new User();
  newUser.username = username;
  newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(9));
  newUser.firstname = firstname;
  newUser.lastname = lastname;

  newUser.save(function(err, savedUser) {
    if(err) {
      console.log(err);
      res.redirect('/finns-redan');
      return;
    }
    console.log('saved to database');
    res.redirect('/registrerad');
    return res.status(200).send();
  })
});

// Logga in, hitta användare
router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err,user) {
    if(err) {
      console.log(err);
      return res.status(500).send();
    }
    if(!user) {
      res.redirect('/finns-inte');
      return res.status(404).send();
    }
    if (bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      console.log('Du är inloggad.');
      res.redirect('/spara-matratt');
      return res.status(200).send();
    }
    res.redirect('/fel-losen');
    console.log("Fel lösenord!");
  })

});

// Spara sökord
router.post('/week', function(req, res) {
  // Om användaren redan har sökord sparade, ta bort dessa
  Week.remove({user: req.session.user._id}, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            } else {
                console.log('Removed old week');
            }
        }
    );

  // Skapa ny vecka med sökord
  var newWeek = new Week();
  newWeek.user = req.session.user._id;
  for (var i = 0; i < Weekdays.length; i++) {
    newWeek[Weekdays[i]] = req.body[Weekdays[i]];
  }

  newWeek.save(function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('saved to database');
    res.redirect('/sokord-sparade');
  })
});

// Slumpa matsedel
router.get('/generate-menu', function(req, res) {
  // Om användaren redan har en meny sparad, ta bort denna
  Menu.remove({user: req.session.user._id}, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            } else {
                console.log('Removed old menu');
            }
        }
    );

  // Hämta sökorden som användaren har lagt till
  Week.find({user: req.session.user._id}, function(err, result) {
    if (err) {
      return console.log(err)
    }

    // Skapa en ny matsedel
    var newMenu = new Menu();
    newMenu.user = req.session.user._id;
    newMenu.save(function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('saved to database');
    });
    for (var i = 0; i < Weekdays.length; i++) {
      saveWeekday(newMenu, Weekdays[i], result[0]);
    }

    res.redirect('/slumpa-matsedel');

  });

});

// Logga ut användaren
router.get('/logout', function(req, res) {
  req.session.destroy();
  console.log('Du är nu utloggad.');
  res.redirect('/');
  return res.status(200).send();
});


module.exports = router;
