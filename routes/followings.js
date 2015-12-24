var express = require('express');
var router = express.Router();
var Following = require('../app/models/following');
var User = require('../app/models/user');
var _ = require('lodash');

router.post('/', function(req, res) {
  Following.findOne(req.body)
  .then(function(following) {
    
    // Following.update({_id: (following||{})._id}, req.body, {upsert: true, setDefaultsOnInsert: true}, cb);
    
    if(following) {
      following.isActive = true;
      return following.save().then(function(following){ return following; })
    } else {
      return Following.create(req.body).then(function(following){ return following; })
    }
  })
  .then(function(following){
    res.json(following)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.delete('/:followingId', function(req, res) {
  Following.findOneAndUpdate({_id: req.params.following},{isActive: false})
  .then(function(following){
    res.json(following)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.get('/', function(req, res) {
  Following.find(req.query).exec()
  .then(function(followings){
    res.json(followings)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.post('/batch', function(req, res) {
  console.log(req.body.facebookIds.split(","))

  Following.find({follower: req.currentUser}).exec()
  .then(function(followings){
    console.log("^^^^^followings")
    console.log(followings)
    
    return User.find({
      facebookId: { $in: req.body.facebookIds.split(",") },
      _id: { $nin: _.map(followings,function(following){ return following.followee; }) }
    }).exec()
    .then(function(users){
      console.log("^^^^^users")
      console.log(users)
      
      return _.map(users,function(user){ return {follower: req.currentUser._id, followee: user} });
    })
  })
  .then(function(followingData){
    console.log("^^^^^followingData")
    console.log(followingData)
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
    Following.create(followingData)
    .then(function(){
      console.log("^^^^^fin")
      res.json("");
    })
  })
    
});


module.exports = router;
