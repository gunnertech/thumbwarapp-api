var express = require('express');
var router = express.Router();
var Device = require('../app/models/device');
var _ = require('lodash');

router.post('/', function(req, res) {
  Device.findOne(req.body).exec()
  .then(function(device){
    if device {
      return device
    } else {
      return Device.create(req.body)
    }
  })
  .then(function(device){
    console.log(device)
    res.json(device)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

module.exports = router;
