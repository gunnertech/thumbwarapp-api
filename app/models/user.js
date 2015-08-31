var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Product     = require('./product');
var Useage     = require('./useage');

var UserSchema   = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  zipCode: { type: String, required: true },
  birthDate: { type: Date, required: true },
  acceptedTosOn: { type: Date, required: true },
  password: { type: String, required: true },
  token: { type: String },
});

UserSchema.path('email').validate(function (value) {
   var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   return emailRegex.test(value); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

UserSchema.methods.products = function (done) {
  return this.model('Product').find({user: this}, done);
};

UserSchema.methods.useages = function (done) {
  return this.model('Useage').find({user: this}, done);
   // .populate('product')
   // .exec
};

UserSchema.statics.findByToken = function (token, cb) {
  return this.findOne({ token: token }, cb);
}

if (!UserSchema.options.toJSON) UserSchema.options.toJSON = {};
UserSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  delete ret.token;
  delete ret.password;
}

UserSchema.methods.products = function (done) {
  return Product.find({store: this}, done);
};

// UserSchema.methods.useages = function (done) {
//   return this.products(function(err, products) {
//     if (err) return next(err);
//     this.model('Useage').find({product: { $in: products }}, done);
//   })
// };

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.pre('save', function(next) { 
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
 
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
 
    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
 
        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);