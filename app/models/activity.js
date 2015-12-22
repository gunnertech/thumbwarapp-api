var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ActivitySchema   = new Schema({
  body: {type: String, required: true},
  activitableType: {type: String, required: true},
  activitableId: Schema.Types.ObjectId,
  data: Schema.Types.Mixed,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


module.exports = mongoose.model('Activity', ActivitySchema);