var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var SidingSchema   = new Schema({
  didSideWithCreator: { type: Boolean, required: true },
  didWin: { type: Boolean },
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  thumbwar: {type: Schema.Types.ObjectId, ref: 'Thumbwar', required: true}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


module.exports = mongoose.model('Siding', SidingSchema);