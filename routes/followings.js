var express = require('express');
var router = express.Router();
var Following = require('../app/models/following');
var User = require('../app/models/user');
var _ = require('lodash');

router.post('/batch', function(req, res) {
  console.log(req.body.facebookIds)
  
  User.find({
    facebookId: { $in: req.body.facebookIds }
  }).exec()
  .then(function(users){
    
    console.log("HERE IS THE " + users.length + "!!!");
    console.log(users);
    
    if(!users.length) {
      res.json("");
    } else {
      res.json("weird");
      // _.each(users,function(user){
      //   Following.count({
      //     followee: req.currentUser,
      //     follower: user
      //   }).exec()
      //   .then(function(count){
      //     if(count < 1) {
      //       // user.follow(req.currentUser);
      //     }
      //
      //     Following.find({
      //       followee: user,
      //       follower: req.currentUser
      //     })
      //     .then(function(followings){
      //       if(followings.length < 1) {
      //         // req.currentUser.follow(user);
      //       }
      //
      //       res.json("");
      //
      //     });
      //   });
      // });
    }
  })
  .catch(function(err){
    console.log(err)
    res.status(500).json(err);
  });
    
    
  
  //   Following.find({
  //     $and: [
  //       { $or: [ followee: req.currentUser, follower: user ] },
  //       { $or: [ followee: user, follower: req.currentUser ] },
  //     ]
  //   })
  // );  
});


module.exports = router;
