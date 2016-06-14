var mongoose = require('mongoose');
var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var app = require('../app.js');



var dishSchema = new Schema({
  user: {type : Schema.Types.ObjectId, ref: 'User'},
  name: String,
  found_at: String,
  keywords: [String]
});
//
// var menuSchema = new Schema({
//   user: {type : Schema.Types.ObjectId, ref: 'User'},
//   week_name: String,
//   menu: [
//     {Monday: {type : Schema.Types.ObjectId, ref: 'Dish'}},
//     {Tuesday: {type : Schema.Types.ObjectId, ref: 'Dish'}},
//     {Wednesday: {type : Schema.Types.ObjectId, ref: 'Dish'}},
//     {Thursday: {type : Schema.Types.ObjectId, ref: 'Dish'}},
//     {Friday: {type : Schema.Types.ObjectId, ref: 'Dish'}},
//     {Saturday: {type : Schema.Types.ObjectId, ref: 'Dish'}},
//     {Sunday: {type : Schema.Types.ObjectId, ref: 'Dish'}}
//   ]
// });
//


// var userSchema = new Schema({
//  username: {type: String, unique: true},
//  password: {type: String},
//  firstname: String,
//  lastname: String
// });

// userSchema.pre('save', function(next) {
//     var user = this;
//
//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();
//
//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);
//
//         // hash the password using our new salt
//         bcrypt.hash(user.password, salt, null, function(err, hash) {
//             if (err) return next(err);
//
//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
//     //next();
// });
//
// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };


var Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;


// var User = mongoose.model('User', userSchema);
// module.exports = User;




// var Menu = mongoose.model('Menu', menuSchema);
// var newMenu;
//
// var Keywords = mongoose.model('Keywords', keywordsSchema);
// var newKeywords;
//
// var User = mongoose.model('User', userSchema);
// var newUser;
