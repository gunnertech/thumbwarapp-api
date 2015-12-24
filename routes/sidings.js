var express = require('express');
var router = express.Router();
var Siding = require('../app/models/siding');
var Thumbwar = require('../app/models/thumbwar');
var _ = require('lodash');

router.post('/', function(req, res) {
  if(req.me) {
    req.body.user = req.currentUser;
  }
  var thumbwar;
  var siding;
  
  Thumbwar.findById(req.body.thumbwar).exec()
  .then(function(t){
    thumbwar = t;
    return Siding.create(req.body)
  })
  .then(function(s){
    siding = s
    thumbwar.sidings.push(siding);
    return thumbwar.save()
  })
  .then(function(thumbwar){
    thumbwar
  })
  .then(undefined, function (err) {
    console.log(err.stack)
    res.status(500).json(err)
  });
});


router.get('/', function(req, res) {
  Siding.find(req.query).exec()
  .then(function(sidings){
    res.json(sidings)
  })
  .then(undefined, function (err) {
    console.log(err)
    res.status(500).json(err)
  });
});


module.exports = router;
