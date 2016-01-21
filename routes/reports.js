var express = require('express');
var router = express.Router();
var Report = require('../app/models/report');

router.post('/', function(req, res) {
  
  Report.create(req.body)
  .then(function(report){
    res.json(report)
  })
  .then(undefined, function (err) {
    console.log(err.stack)
    res.status(500).json(err)
  });
});


module.exports = router;
