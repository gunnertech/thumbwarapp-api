var express = require('express');
var router = express.Router();
// var Following = require('../app/models/following');
var User = require('../app/models/user');
var _ = require('lodash');


router.post('/batch', function(req, res) {
  return res.format({
    json: function(){
      return res.json("");
    }
  })
});


module.exports = router;
