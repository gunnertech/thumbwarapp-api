var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var User = require('./user');


var FollowingSchema   = new Schema({
  isActive: { type: Boolean, required: true },
  followee: {type: Schema.Types.ObjectId, ref: 'User'},
  follower: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


module.exports = mongoose.model('Following', FollowingSchema);