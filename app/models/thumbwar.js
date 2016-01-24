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

ThumbwarSchema.pre('save', function (next) {
    var User = require('./user');
    var _this = this;
    
    User.findById(this.creator).exec()
    .then(function(user){
      _this.creator = user;
      next();
    });
    
    
});

ThumbwarSchema.post('findOneAndUpdate', function(doc) {
  var Activity = require('./activity');
  var Following = require('./following');
  var Siding = require('./siding');
  var _this = this;
  
  Siding.find({thumbwar: doc._id}).exec()
  .then(function(sidings){
    _.each(sidings,function(siding){ 
      if(siding.chosenOutcome == doc.assertion && doc.outcome == "won") {
        siding.didWin = true;
      } else if(siding.chosenOutcome != doc.assertion && doc.outcome == "lost") {
        siding.didWin = true;
      } else {
        siding.didWin = false;
      }
    });
  });
  
  if(!doc.isPrivate) {
    Following.find({followee: doc.creator}).exec()
    .then(function(followings){
      _.each(followings,function(following){
        Activity.create({
          isAnonymous: doc.isAnonymous,
          body: (doc.outcome == 'won' ? "Declared Victory!" : "Admitted Defeat!"),
          pushBody: _this.creator.name + " " + (doc.outcome == 'won' ? "Declared Victory!" : "Admitted Defeat!"),
          activitableId: doc._id,
          activitableType: "Thumbwar",
          target: following.followee,
          object: doc.creator
        });
      });
    });
  }
  
  if(doc.subject && !doc.subject.equals(doc.creator._id)) {
    Activity.create({
      isAnonymous: doc.isAnonymous,
      body: (doc.outcome == 'won' ? "Declared Victory!" : "Admitted Defeat!"),
      pushBody: _this.creator.name + " " + (doc.outcome == 'won' ? "Declared Victory!" : "Admitted Defeat!"),
      activitableId: doc._id,
      activitableType: "Thumbwar",
      target: doc.subject,
      object: doc.creator
    });
  }
  
  
})



ThumbwarSchema.post('save', function(doc) {
  if (!this.wasNew) { return true; }
  
  var _this = this;
  var Activity = require('./activity');
  var Following = require('./following');
  var User = require('./user');
  
  if(doc.subject && !doc.subject.equals(doc.creator._id)) {
    Activity.create({
      isAnonymous: doc.isAnonymous,
      body: ("You " + doc.assertion + " " + doc.body),
      pushBody: (_this.creator.name + ": You " + doc.assertion + " " + doc.body),
      activitableId: doc._id,
      activitableType: "Thumbwar",
      target: doc.subject,
      object: doc.creator
    });
  }
  
  if(!doc.isPrivate) {

    
    User.findOne({_id: doc.subject}).exec()
    .then(function(user){
      var subjectText = doc.subjectText;
      
      if(doc.isAnonymous) {
        subjectText = "Someone";
      }
      
      
      Following.find({follower: doc.creator}).exec()
      .then(function(followings){
        _.each(followings,function(following){
          Activity.create({
            isAnonymous: doc.isAnonymous,
            body: (subjectText + " " + doc.assertion + " " + doc.body),
            pushBody: (_this.creator.name + ": " + subjectText + " " + doc.assertion + " " + doc.body),
            activitableId: doc._id,
            activitableType: "Thumbwar",
            target: following.followee,
            object: doc.creator
          });
        });
      });
    })
    
  }
    
});


module.exports = mongoose.model('Thumbwar', ThumbwarSchema);