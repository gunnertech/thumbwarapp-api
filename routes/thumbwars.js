var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Thumbwar = require('../app/models/thumbwar');
var _ = require('lodash');

function parseMe(req, res, next) {
  console.log("got it");
  if(req.params && req.params.userId == 'me') {
    console.log("it does" + req.currentUser._id);
    req.me = true;
    req.params.userId = req.currentUser._id;
  }
  next();
}

// function convertDateToUTC(date) {
//     return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
// }

router.use(function (req, res, next) {
  if(req.me && req.body) {
    req.body.creator = req.currentUser._id;
  }
  next();
});

router.user(parseMe);

router.get('/', function(req, res, next) {  
  if(req.query.pagination) {
    var pagination = req.query.pagination;
    delete req.query.pagination
    
    req.query.createdAt = {
      $lt: new Date(pagination.olderThan)
    }
  }
  
  Thumbwar.find(req.query)
  .populate('creator')
  .populate('subject')
  .exec()
  .then(function(thumbwars){
    res.json(thumbwars)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.get('/:thumbwarId', function(req, res, next) {  
  Thumbwar.findById(req.params.thumbwarId)
  .populate('creator')
  .populate('subject')
  .exec()
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});


router.post('/', function(req, res) {
  Thumbwar.create(req.body)
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

module.exports = router;
