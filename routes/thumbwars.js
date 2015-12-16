var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Thumbwar = require('../app/models/thumbwar');
var _ = require('lodash');

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
  
  console.log(req.body);
  
  Thumbwar.create(req.body)
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .catch(function(err){
    // just need one of these
    console.log('error:', err);
  });
});

module.exports = router;
