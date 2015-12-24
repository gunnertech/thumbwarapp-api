var express = require('express');
var router = express.Router();
var Siding = require('../app/models/siding');
var _ = require('lodash');

router.post('/', function(req, res) {
  if(req.me) {
    req.body.user = req.currentUser;
  }
  Siding.create(req.body)
  .then(function(siding){
    res.json(siding)
  })
  .then(undefined, function (err) {
    console.log(err)
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
