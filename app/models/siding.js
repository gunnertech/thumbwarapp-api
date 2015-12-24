var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var SidingSchema   = new Schema({
  chosenOutcome: { type: String, required: true, enum: ['will', 'wont'] },
  didWin: { type: Boolean },
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  thumbwar: {type: Schema.Types.ObjectId, ref: 'Thumbwar', required: true}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

SidingSchema.set('toJSON', { getters: true, virtuals: true });

SidingSchema.virtual('thumbwarId').get(function () {
  return this.thumbwar.creator ? thumbwar._id : thumbwar;
});

SidingSchema.virtual('userId').get(function () {
  return this.user.name ? user._id : user;
});


module.exports = mongoose.model('Siding', SidingSchema);