var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ThumbwarSchema   = new Schema({
  isPrivate: { type: Boolean, required: true, default: false },
  isAnonymous: { type: Boolean, required: true, default: false },
  body: { type: String, required: true },
  subjectText: { type: String, required: true },
  outcome: { type: String, required: true, index: true },
  subject: {type: Schema.Types.ObjectId, ref: 'User'},
  creator: {type: Schema.Types.ObjectId, ref: 'User'}
});



module.exports = mongoose.model('Following', FollowingSchema);