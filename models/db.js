var mongoose = require('mongoose');
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
var keywordsSchema = new Schema({
  user: {type : Schema.Types.ObjectId, ref: 'User'},
  keywords_week: [
    {Monday: [String]},
    {Tuesday: [String]},
    {Wednesday: [String]},
    {Thursday: [String]},
    {Friday: [String]},
    {Saturday: [String]},
    {Sunday: [String]}
  ]
});
//
// var userSchema = new Schema({
//     username: { type: Schema.Types.ObjectId, required: true, index: { unique: true } },
//     password: { type: Schema.Types.ObjectId, required: true }
// });



var Dish = mongoose.model('Dish', dishSchema);
module.exports = Dish;

// var Menu = mongoose.model('Menu', menuSchema);
// var newMenu;
//
// var Keywords = mongoose.model('Keywords', keywordsSchema);
// var newKeywords;
//
// var User = mongoose.model('User', userSchema);
// var newUser;
