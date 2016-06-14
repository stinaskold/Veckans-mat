var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = require('../app.js');

var weekSchema = new Schema({
    user: {type : Schema.Types.ObjectId, ref: 'User'},
    Monday: [String],
    Tuesday: [String],
    Wednesday: [String],
    Thursday: [String],
    Friday: [String],
    Saturday: [String],
    Sunday: [String]

  // keywords_week: [
  //   {Monday: [String]},
  //   {Tuesday: [String]},
  //   {Wednesday: [String]},
  //   {Thursday: [String]},
  //   {Friday: [String]},
  //   {Saturday: [String]},
  //   {Sunday: [String]}
  // ]
});

var Week = mongoose.model('Week', weekSchema);
module.exports = Week;
