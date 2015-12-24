var express = require('express');
var router = express.Router();
var Siding = require('../app/models/siding');
var Thumbwar = require('../app/models/thumbwar');
var _ = require('lodash');

router.post('/', function(req, res) {
  if(req.me) {
    req.body.user = req.currentUser;
  }
  Thumbwar.findById(req.body.thumbwarId).exec()
  .then(function(thumbwar){
      return Siding.create(req.body)
      .then(function(siding){
        thumbwar.sidings.append(siding)
        return thumbwar.save().then(function(thumbwar) {
          return siding;
      })
    })
  })
  .then(function(siding){
    console.log(siding.thumbwar)
    return Thumbwar.findById(siding.thumbwar).exec()
    
  })
  .then(function(siding){
    console.log(siding)
    res.json(siding)
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
