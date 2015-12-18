var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Thumbwar = require('../app/models/thumbwar');
var _ = require('lodash');



router.use(function (req, res, next) {
  if(req.me && req.body) {
    req.body.creator = req.currentUser._id;
  }
  next();
});

router.get('/', function(req, res, next) {  
  Thumbwar.find(req.query)
  .populate('creator')
  .populate('subject')
  .exec()
  .then(function(thumbwars){
    console.log(thumbwars)
    res.json(thumbwars)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});


router.post('/', function(req, res) {
  console.log(req.body);
  Thumbwar.create(req.body)
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

module.exports = router;
