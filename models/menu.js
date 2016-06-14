var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = require('../app.js');

var menuSchema = new Schema({
  user: {type : Schema.Types.ObjectId, ref: 'User'},
  Monday: {type : Schema.Types.ObjectId, ref: 'Dish'},
  Tuesday: {type : Schema.Types.ObjectId, ref: 'Dish'},
  Wednesday: {type : Schema.Types.ObjectId, ref: 'Dish'},
  Thursday: {type : Schema.Types.ObjectId, ref: 'Dish'},
  Friday: {type : Schema.Types.ObjectId, ref: 'Dish'},
  Saturday: {type : Schema.Types.ObjectId, ref: 'Dish'},
  Sunday: {type : Schema.Types.ObjectId, ref: 'Dish'}
})



var Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
