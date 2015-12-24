var express = require('express');
var router = express.Router();
var Siding = require('../app/models/siding');
var _ = require('lodash');

router.post('/', function(req, res) {
  req.body.user = req.currentUser._id;
  console.log(req.body)
  Siding.create(req.body)
  .populate('user')
  .populate('thumbwar')
  .then(function(siding){
    console.log("DONE")
    res.json(siding)
  })
  
});


router.get('/', function(req, res) {
  Siding.find(req.query).exec()
  .then(function(sidings){
    res.json(sidings)
  })
  .then(null, function (err) {
    console.log(err)
    res.status(500).json(err)
  });
});


module.exports = router;
