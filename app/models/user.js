var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt = require('bcrypt');
var knox = require('knox');
var https = require('follow-redirects').https;
var SALT_WORK_FACTOR = 10;
var Avatar = require('./avatar');

var client = knox.createClient({
    key: process.env.AWS_KEY
  , secret: process.env.AWS_SECRET
  , bucket: process.env.S3_BUCKET
});

var UserSchema   = new Schema({
  facebookId: { type: String, required: true, index: { unique: true } },
  email: { type: String, trim: true, required: true, index: { unique: true }},
  name: { type: String },
  photoUrl: { type: String },
  token: { type: String, required: true, index: { unique: true } },
  avatar: {type: Schema.Types.ObjectId, required: true, ref: 'Avatar'}
});

UserSchema.pre('save',true,function(next,done){
  var _this = this;
  var fileName = _this.name.toLowerCase().replace(/\W+/g,"-")
  next();
  
  https.get(this.photoUrl, function(res){
    var headers = {
        'Content-Length': res.headers['content-length']
      , 'Content-Type': res.headers['content-type']
      , 'x-amz-acl': 'public-read'
    };
    
    var req = client.putStream(res, '/uploads/users/'+fileName+'.jpg', headers, function(err, res){
    });
    
    req.on('response', function(res){
      _this.avatar = new Avatar({
        url: "https://"+process.env.S3_BUCKET+".s3.amazonaws.com/uploads/users/"+fileName+".jpg"
      })
      done();
     });
  });
});

UserSchema.path('email').validate(function (value) {
  if(!value) { return true; }
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(value); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')


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
