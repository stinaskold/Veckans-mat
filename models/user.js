var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = require('../app.js');

// var userSchema = new Schema({
//     username: { type: Schema.Types.ObjectId, required: true, index: { unique: true } },
//     password: { type: Schema.Types.ObjectId, required: true }
// });

var userSchema = new Schema({
 username: {type: String, unique: true},
 password: {type: String},
 firstname: String,
 lastname: String
});

/*userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}*/

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

var User = mongoose.model('User', userSchema);
module.exports = User;
