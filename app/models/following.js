var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');


var FollowingSchema   = new Schema({
  status: { type: Boolean, required: true, index: { unique: true } },
  followee: {type: Schema.Types.ObjectId, ref: 'User'},
  follower: {type: Schema.Types.ObjectId, ref: 'User'}
});


module.exports = mongoose.model('Following', FollowingSchema);