var express = require('express');
var router = express.Router();
var Following = require('../app/models/following');
var User = require('../app/models/user');
var _ = require('lodash');
var async = require('async');

router.post('/batch', function(req, res) {
  console.log(req.body.facebookIds.split(","))

  Following.find({follower: req.currentUser}).exec()
  .then(function(followings){
    console.log("^^^^^followings")
    return User.find({
      facebookId: { $in: req.body.facebookIds.split(",") },
      _id: { $nin: _.map(followings,function(following){ return following.followee; }) }
    }).exec()
    .then(function(users){
      console.log("^^^^^users")
      return _.map(users,function(user){ return {follower: req.currentUser._id, followee: user} });
    })
  })
  .then(function(followingData){
    console.log("^^^^^followingData")
    return Following.create(followingData)
    .then(function(){
      console.log("^^^^^null")
      return null;
    })
  })
  .then(function(){
    console.log("^^^^^null again")
    return Following.find({followee: req.currentUser}).exec()
    .then(function(followings){
      return followings;
    })
  })
  .then(function(followings){
    console.log("^^^^^followings again")
    return User.find({
      facebookId: { $in: req.body.facebookIds.split(",") },
      _id: {
        $nin: _.map(followings,function(following){ return following.follower; })
      }
    }).exec()
    .then(function(users){
      console.log("^^^^^users again")
      return _.map(users,function(user){ return {followee: req.currentUser._id, followeer: user} });
    })
  })
  .then(function(followingData){
    console.log("^^^^^followingData again")
    return Following.create(followingData)
    .then(function(){
      console.log("^^^^^fin")
      res.json("");
    })
  }) 
  .catch(function(err){
    console.log("THERE IS AN ERROR")
    console.log(err)
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
