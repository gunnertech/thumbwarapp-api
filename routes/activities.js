var express = require('express');
var router = express.Router();
var Activity = require('../app/models/activity');
var _ = require('lodash');


router.get('/', function(req, res, next) {  
  if(req.query.pagination) {
    var pagination = req.query.pagination;
    delete req.query.pagination
    
    req.query.createdAt = {
      $lt: new Date(pagination.olderThan)
    }
  }
  
  console.log(req.query)
  
  Activity.find(req.query)
  .populate('target')
  .populate('object')
  .sort({createdAt: 'desc'})
  .exec()
  .then(function(activities){
    console.log(activities)
    res.json(activities)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});


module.exports = router;
