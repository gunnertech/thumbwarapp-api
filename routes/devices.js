var express = require('express');
var router = express.Router();
var Device = require('../app/models/device');
var _ = require('lodash');

router.post('/', function(req, res) {
  Device.findOne(req.body).exec()
  .then(function(device){
      return Device.update({_id: (device||{})._id}, req.body, {upsert: true, setDefaultsOnInsert: true}, {'new': true})
  })
  .then(function(devices){
    console.log(devices)
    res.json(devices)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});

module.exports = router;
