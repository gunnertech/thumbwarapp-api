var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var CommentSchema   = new Schema({
  body: {type: String, required: true},
  thumbwar: {type: Schema.Types.ObjectId, ref: 'Thumbwar', required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

CommentSchema.post('save', function(doc) {
  var Activity = require('./activity');
  var Thumbwar = require('./thumbwar');
  var User = require('./user');
  
  Thumbwar.findById(doc.thumbwar).populate('creator').exec()
  .then(function(thumbwar){
    console.log("~~~~~~~~~" + thumbwar)
    thumbwar.comments.push(doc);
    thumbwar.save();
    
    _.each(thumbwar.comments,function(comment){ 
      User.findById(comment.user).exec()
      .then(function(user){
        if(comment.user != thumbwar.creator) {
          Activity.create({
            body: "also replied to "+user.name+"'s ThumbWar!",
            activitableId: thumbwar._id,
            activitableType: "Thumbwar",
            target: user,
            object: doc.user
          });
        }
      });
    });
    
    Activity.create({
      body: "replied to your ThumbWar!",
      activitableId: thumbwar._id,
      activitableType: "Thumbwar",
      target: thumbwar.creator,
      object: doc.user
    }).then(function(activity){
      console.log("~~~~~~~~~~~~ACTIVITY");
    })
    
    
  });
    
});


module.exports = mongoose.model('Comment', CommentSchema);