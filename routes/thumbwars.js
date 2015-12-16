var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Thumbwar = require('../app/models/thumbwar');
var _ = require('lodash');

router.param("userId", function(req, res, next, userId) {
  console.log("HEREEEEEE")
  if(userId == 'me') {
    console.log("it does");
    req.params.userId = req.currentUser._id;
  }
  next();
});

router.use(function (req, res, next) {
  console.log("look hre")
  console.log(req.params);
  if(req.params && req.params.userId == "me") {
    req.params.userId = req.currentUser._id;
  }
  
  if(req.body && req.params && req.params.userId) {
    req.body.creator = req.params.userId
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
