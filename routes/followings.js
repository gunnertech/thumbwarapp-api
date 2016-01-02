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
  Following.findOneAndUpdate({_id: req.params.followingId},{isActive: false},{'new':true})
  .then(function(following){
    res.json(following)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.put('/:followingId', function(req, res) {
  console.log(req.body)
  Following.findOneAndUpdate({_id: req.params.followingId},req.body,{'new':true})
  .then(function(following){
    res.json(following)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.get('/', function(req, res) {
  console.log(req.query);
  
  Following.find(req.query)
  .populate('follower')
  .populate('followee')
  .exec()
  .then(function(followings){
    res.json(followings)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.post('/batch', function(req, res) {
  Following.find({follower: req.currentUser}).exec()
  .then(function(followings){
    
    return User.find({
      facebookId: { $in: req.body.facebookIds.split(",") },
      _id: { $nin: _.map(followings,function(following){ return following.followee; }) }
    })
  })
  .then(function(users){
    return Following.create(
      _.map(users,function(user){ return {follower: req.currentUser._id, followee: user._id} })
    );
  })
  .then(function(followings){
    return Following.find({followee: req.currentUser})
  })
  .then(function(followings){
    return User.find({
      facebookId: { $in: req.body.facebookIds.split(",") },
      _id: { $nin: _.map(followings,function(following){ return following.follower; }) }
    })
  })
  .then(function(users){
    return Following.create(
      _.map(users,function(user){ return {followee: req.currentUser._id, follower: user._id} })
    )
  })
  .then(function(followings){
    res.json("");
  })
  .then(undefined, function (err) {
    console.log(err)
    console.log(err.trace)
    res.status(500).json(err)
  });

    
});


module.exports = router;
