var express = require('express');
var router = express.Router();
var Comment = require('../app/models/comment');
var _ = require('lodash');

router.post('/', function(req, res) {
  Comment.create(req.body)
  .then(function(comment){
    res.json(comment)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

router.get('/', function(req, res) {
  if(req.query.pagination) {
    var pagination = req.query.pagination;
    delete req.query.pagination
    
    req.query.createdAt = {
      $lt: new Date(pagination.olderThan)
    }
  }
  
  Comment.find(req.query).exec()
  .then(function(comments){
    res.json(comments)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});


module.exports = router;
