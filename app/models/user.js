var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema   = new Schema({
  facebookId: { type: String, required: true, index: { unique: true } },
  email: { type: String, trim: true, required: true, index: { unique: true }},
  name: { type: String },
  token: { type: String, required: true, index: { unique: true } }
});

UserSchema.path('email').validate(function (value) {
  if(!value) { return true; }
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(value); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')


UserSchema.methods.compareResetTokenValidity = function (token) {
  if (token === this.resetPasswordToken) {
    var oneHour = 1000 * 60 * 60
    var timeElapsed = (new Date - this.resetPasswordInitOn)

    if (timeElapsed < oneHour) {
      return true;
    }
  }

  return false;
}

UserSchema.statics.findByToken = function (token, cb) {
  return this.findOne({ token: token }, cb);
}

UserSchema.statics.findByFacebookId = function (facebookId, cb) {
  return this.findOne({ facebookId: facebookId }, cb);
}

if (!UserSchema.options.toJSON) UserSchema.options.toJSON = {};

UserSchema.options.toJSON.transform = function (doc, ret, options) {
  delete ret.token;
}


module.exports = mongoose.model('User', UserSchema);
