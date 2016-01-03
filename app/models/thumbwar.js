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
  assertion: { type: String, required: true, index: true, enum: ['will','won\'t'] },
  outcome: { type: String, index: true, enum: ['won','lost'] },
  subject: {type: Schema.Types.ObjectId, ref: 'User'},
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
  sidings: [{type: Schema.Types.ObjectId, ref: 'Siding'}],
  siders: [{type: Schema.Types.ObjectId, ref: 'User'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

ThumbwarSchema.set('toJSON', { getters: true, virtuals: true });

ThumbwarSchema.virtual('commentsCount').get(function () {
  return this.comments.length;
});

ThumbwarSchema.virtual('sidingsCount').get(function () {
  return this.sidings.length;
});

ThumbwarSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

ThumbwarSchema.post('findOneAndUpdate', function(doc) {
  var Activity = require('./activity');
  var Following = require('./following');
  
  Following.find({followee: doc.creator}).exec()
  .then(function(followings){
    _.each(followings,function(following){
      Activity.create({
        isAnonymous: doc.isAnonymous,
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
  if (!this.wasNew) { return true; }
  
  
  var Activity = require('./activity');
  var Following = require('./following');
  
  console.log("~~~~~~~~~SUBJECT " + doc.subject)
  console.log("~~~~~~~~~SUBJECT ID " + doc.subject._id)
  console.log("~~~~~~~~~CREATOR " + doc.creator)
  console.log("~~~~~~~~~CREATOR ID " + doc.creator._id)
  console.log("~~~~~~~~TEST IT equals: " + doc.subject.equals(doc.creator._id))
  console.log("~~~~~~~~TEST IT toString: " + doc.subject.toString() == doc.creator._id.toString())
  
  if(doc.subject && !doc.subject.equals(doc.creator._id)) {
    Activity.create({
      isAnonymous: doc.isAnonymous,
      body: "challenged you to a Thumbwar!",
      activitableId: doc._id,
      activitableType: "Thumbwar",
      target: doc.subject,
      object: doc.creator
    });
  }
  
  Following.find({follower: doc.creator}).exec()
  .then(function(followings){
    _.each(followings,function(following){
      Activity.create({
        isAnonymous: doc.isAnonymous,
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