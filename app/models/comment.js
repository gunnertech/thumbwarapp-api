var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var CommentSchema   = new Schema({
  body: {type: String, required: true},
  thumbwar: {type: Schema.Types.ObjectId, ref: 'Thumbwar', required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


module.exports = mongoose.model('Comment', CommentSchema);