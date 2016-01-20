var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var _ = require('lodash');

var CommentSchema   = new Schema({
  body: {type: String, required: true},
  thumbwar: {type: Schema.Types.ObjectId, ref: 'Thumbwar', required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

CommentSchema.post('save', function(doc) {
  var Activity = require('./activity');
  var Thumbwar = require('./thumbwar');
  var User = require('./user');
  var alertedUsers = [];
  
  Thumbwar.findById(doc.thumbwar).populate('creator').populate('subject').exec()
  .then(function(thumbwar){
    thumbwar.comments.push(doc);
    thumbwar.save();
    
    _.each(thumbwar.comments,function(comment){ 
      User.findById(comment.user).exec()
      .then(function(user){
        if(comment.user != thumbwar.creator && !_.find(alertedUsers,user)) {
          alertedUsers.push(user)
          Activity.create({
            body: doc.user.name + " also replied to "+thumbwar.creator.name+"'s ThumbWar!",
            activitableId: thumbwar._id,
            activitableType: "Thumbwar",
            target: user,
            object: doc.user
          });
        }
      });
    });

    if(!doc.user.equals(thumbwar.creator)) {
      console.log("~~~~~~~ok " + doc.user.name)
      Activity.create({
        body: doc.user.name + " replied to your ThumbWar!",
        activitableId: thumbwar._id,
        activitableType: "Thumbwar",
        target:  thumbwar.creator,
        object: doc.user
      });
      
      console.log("~~~~~~~done " + doc.user)
       
    }
    
    if(thumbwar.subject && !thumbwar.subject.equals(thumbwar.creator)) {
      Activity.create({
        body: doc.user.name + " commeonted on your ThumbWar!",
        activitableId: thumbwar._id,
        activitableType: "Thumbwar",
        target: thumbwar.subject,
        object: doc.user
      });
    }    
    
  });
    
});


module.exports = mongoose.model('Comment', CommentSchema);