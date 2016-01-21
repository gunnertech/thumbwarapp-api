var express = require('express');
var router = express.Router();
var Report = require('../app/models/report');

router.post('/', function(req, res) {
  
  Siding.create(req.body)
  .then(function(siding){
    res.json(siding)
  })
  .then(undefined, function (err) {
    console.log(err.stack)
    res.status(500).json(err)
  });
});


module.exports = router;
