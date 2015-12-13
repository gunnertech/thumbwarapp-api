var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt = require('bcrypt');
var knox = require('knox');
var SALT_WORK_FACTOR = 10;

var UserSchema   = new Schema({
  facebookId: { type: String, required: true, index: { unique: true } },
  email: { type: String, trim: true, required: true, index: { unique: true }},
  name: { type: String },
  photoUrl: { type: String },
  token: { type: String, required: true, index: { unique: true } }
});

var client = knox.createClient({
    key: process.env.AWS_KEY
  , secret: process.env.AWS_SECRET
  , bucket: process.env.S3_BUCKET
});

UserSchema.pre('save',true,function(next,done){
  next();
  
  http.get(this.photoUrl, function(res){
    var headers = {
        'Content-Length': res.headers['content-length']
      , 'Content-Type': res.headers['content-type']
    };
    client.putStream(res, '/'+this.name.toLowerCase().replace(/\W+/g,"-")+'.jpg', headers, function(err, res){
      console.log(res);
      done();
    });
  });
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
