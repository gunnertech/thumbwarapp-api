var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var _ = require('lodash');


var ThumbwarSchema   = new Schema({
  isPrivate: { type: Boolean, required: true, default: false },
  isAnonymous: { type: Boolean, required: true, default: false },
  body: { type: String, required: true },
  subjectText: { type: String, required: true },
  outcomeMediaUrl: { type: String },
  outcomeMediaType: { type: String },
  assertion: { type: String, required: true, index: true },
  outcome: { type: String, index: true, enum: ['won','lost'] },
  subject: {type: Schema.Types.ObjectId, ref: 'User'},
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
  sidings: [{type: Schema.Types.ObjectId, ref: 'Siding'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

ThumbwarSchema.set('toJSON', { getters: true, virtuals: true });

ThumbwarSchema.virtual('commentsCount').get(function () {
  return this.comments.length;
});

ThumbwarSchema.virtual('sidingsCount').get(function () {
  return this.sidings.length;
});

ThumbwarSchema.post('findOneAndUpdate', function(doc) {
  var Activity = require('./activity');
  var Following = require('./following');
  
  Following.find({followee: doc.creator}).exec()
  .then(function(followings){
    _.each(followings,function(following){
      Activity.create({
        body: (doc.outcome == 'won' ? "Declared Victory!" : "Admitted Defeat!"),
        activitableId: doc._id,
        activitableType: "Thumbwar",
        target: following.followee,
        object: doc.creator
      });
    });
  });
})



ThumbwarSchema.post('save', function(doc) {
  var Activity = require('./activity');
  var Following = require('./following');
  
  Following.find({followee: doc.creator}).exec()
  .then(function(followings){
    _.each(followings,function(following){
      Activity.create({
        body: "declared a Thumbwar!",
        activitableId: doc._id,
        activitableType: "Thumbwar",
        target: following.followee,
        object: doc.creator
      });
    });
  });
    
});


module.exports = mongoose.model('Thumbwar', ThumbwarSchema);