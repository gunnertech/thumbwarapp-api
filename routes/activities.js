var express = require('express');
var router = express.Router();
var Activity = require('../app/models/activity');
var _ = require('lodash');


router.get('/', function(req, res, next) {  
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
  
  Activity.find(req.query)
  .populate('target')
  .populate('object')
  .sort({createdAt: 'desc'})
  .limit(10)
  .exec()
  .then(function(activities){
    res.json(activities)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.get('/count', function(req, res, next) {  
  Activity.count(req.query)
  .exec()
  .then(function(count){
    res.status(200).json({count: count});
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.put('/:activityId', function(req, res, next) {
  Activity.findOneAndUpdate({_id: req.params.activityId }, req.body, {'new': true})
  .populate('target')
  .populate('object')
  .exec()
  .then(function(activity){
    res.json(activity)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});


module.exports = router;
