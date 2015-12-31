var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Thumbwar = require('../app/models/thumbwar');
var Siding = require('../app/models/siding');
var _ = require('lodash');
var mongoose     = require('mongoose');

// function convertDateToUTC(date) {
//     return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
// }

var parseGetQuery = function (req, res, next) {
  if(req.query.pagination) {
    var pagination = req.query.pagination;
    delete req.query.pagination
    
    if(pagination.olderThan) {
      req.query.createdAt = {
        $lt: new Date(pagination.olderThan)
      }
    } else if(pagination.newerThan) {
      req.query.createdAt = {
        $gt: new Date(pagination.newerThan)
      }
    }
  }
  
  if(req.query.subject) {    
    req.query.creator = {
      $ne: req.query.subject
    }
  } else if(req.query.sided) {
    req.query.siders = {
      $in: [req.query.sided]
    };
    delete req.query.sided;
  }
  
  next();
  
  
};

router.get('/', [parseGetQuery,function(req, res) {  
  
  console.log(req.query)
  
  Thumbwar.find(req.query)
  .populate('creator')
  .populate('subject')
  .populate('sidings')
  .sort({createdAt: 'desc'})
  .limit(10)
  .exec()
  .then(function(thumbwars){
    res.json(thumbwars)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
}]);

router.get('/:thumbwarId', function(req, res) {  
  Thumbwar.findById(req.params.thumbwarId)
  .populate('creator')
  .populate('subject')
  .populate('sidings')
  .populate('sidings.user')
  .exec()
  .then(function(thumbwar){
    return Siding.populate(thumbwar,{path: 'sidings.user'})
  })
  .then(function(thumbwar){
    console.log(thumbwar)
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
});

router.put('/:thumbwarId', function(req, res) {
  Thumbwar.findOneAndUpdate({_id: req.params.thumbwarId }, req.body, {'new':true})
  .populate('creator')
  .populate('subject')
  .populate('sidings')
  .populate('sidings.user')
  .exec()
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
});


router.post('/', function(req, res) {
  if(req.me) {
    req.body.creator = req.currentUser;
  }
  Thumbwar.create(req.body)
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
});

module.exports = router;
