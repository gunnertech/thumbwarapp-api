var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var _ = require('lodash');


var ThumbwarSchema   = new Schema({
  isPrivate: { type: Boolean, required: true, default: false },
  isAnonymous: { type: Boolean, required: true, default: false },
  body: { type: String, required: true },
  subjectText: { type: String, required: true },
  assertion: { type: String, required: true, index: true },
  outcome: { type: String, index: true },
  subject: {type: Schema.Types.ObjectId, ref: 'User'},
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
  sidings: [{type: Schema.Types.ObjectId, ref: 'Siding'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

body: {type: String, required: true},
activitableType: {type: String, required: true},
activitableId: Schema.Types.ObjectId,
data: Schema.Types.Mixed,
target: {type: Schema.Types.ObjectId, ref: 'User'},
object: {type: Schema.Types.ObjectId, ref: 'User'}



ThumbwarSchema.post('save', function(doc) {
  var Activity = require('./activity');
  var Following = require('./following');
  console.log("^^^^^^^^^^^^^");
  console.log("Start");
  
  Following.find({followee: doc.creator}).exec()
  .then(function(followings){
    console.log("^^^^^^^^^^^^^");
    console.log(followings.length);
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
    
})


module.exports = mongoose.model('Thumbwar', ThumbwarSchema);