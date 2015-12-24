var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var FollowingSchema   = new Schema({
  isActive: { type: Boolean, required: true, default: true },
  followee: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  follower: {type: Schema.Types.ObjectId, ref: 'User', required: true}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

FollowingSchema.post('save', function(doc) {
  var Activity = require('./activity');
  
  Activity.create({
    body: "started following you!",
    activitableId: doc._id,
    activitableType: "User",
    target: doc.followee,
    object: doc.follower
  });
    
});



module.exports = mongoose.model('Following', FollowingSchema);