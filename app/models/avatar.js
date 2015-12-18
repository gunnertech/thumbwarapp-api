var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt = require('bcrypt');
var ObjectId = Schema.Types.ObjectId;


var AvatarSchema   = new Schema({
  url: { type: String, required: true },
  user: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


module.exports = mongoose.model('Avatar', AvatarSchema);
