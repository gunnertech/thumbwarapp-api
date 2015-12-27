var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var SidingSchema   = new Schema({
  chosenOutcome: { type: String, required: true, enum: ['will', 'won\'t'] },
  didWin: { type: Boolean },
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  thumbwar: {type: Schema.Types.ObjectId, ref: 'Thumbwar', required: true}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

SidingSchema.set('toJSON', { getters: true, virtuals: true });

SidingSchema.virtual('thumbwarId').get(function () {
  return this.thumbwar.creator ? this.thumbwar._id : this.thumbwar;
});

SidingSchema.virtual('userId').get(function () {
  return this.user.name ? this.user._id : this.user;
});

SidingSchema.post('save', function(doc) {
  var Activity = require('./activity');
  var Thumbwar = require('./thumbwar');
  
  Thumbwar.findById(doc.thumbwar).exec().populate('creator')
  .then(function(thumbwar){
    Activity.create({
      body: (doc.choseOutcome == thumbwar.assertion ? "sided with you!" : "sided against you!"),
      activitableId: thumbwar._id,
      activitableType: "Thumbwar",
      target: thumbwar.creator,
      object: doc.user
    });
  });    
});


module.exports = mongoose.model('Siding', SidingSchema);