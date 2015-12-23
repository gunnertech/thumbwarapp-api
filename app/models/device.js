var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var DeviceSchema   = new Schema({
  token: {type: String, required: true},
  platform: {type: String, required: true, default: "ios"},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


module.exports = mongoose.model('Device', DeviceSchema);