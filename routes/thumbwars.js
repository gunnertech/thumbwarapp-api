var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Thumbwar = require('../app/models/thumbwar');
var _ = require('lodash');

require('mongoose').Promise = require('bluebird');



router.use(function (req, res, next) {
  if(req.me && req.body) {
    req.body.creator = req.currentUser._id;
  }
  next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {  
  Thumbwar.find(req.query)
  .populate('creator')
  .populate('subject')
  .exec(function(err, thumbwars) {
    if (err) { return res.send(err); }

    return res.format({
      json: function() {
        return res.json(thumbwars);
        
      }
    });
  });
});


router.post('/', function(req, res) {
  Thumbwar.create(req.body)
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .catch(function(err){
    res.status(500).json(err)
  });
});

module.exports = router;
