var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Following = require('../app/models/following');
var _ = require('lodash');
var jwt = require("jsonwebtoken");
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY)
var uuid = require('node-uuid')

var parseMe = function (req, res, next) {
  if(req.params && req.params.userId == 'me') {
    req.me = true;
    req.params.userId = req.currentUser._id;
  }
  next();
  
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = {};
  
  if(req.query) {
    params = req.query;
    
    if(params.matchType) {
      delete params.matchType;
      
      params.name = new RegExp(params.name, "i");
    }
    
    delete params.token;
  }
  
  
  User.find(params)
  .populate('avatar')
  .exec()
  .then(function(users) {
    res.json(users);
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
});



router.get('/:userId', [parseMe,function(req, res) {
  User.findById(req.params.userId)
  .populate('avatar')
  .exec()
  .then(function(user){
    res.json(user)
  })
  .then(undefined, function (err) {
    res.status(500).json(err)
  });
}]);


router.put('/:user_id', function(req, res) {
  User.findOneAndUpdate({_id: req.params.user_id}, (req.body.user || req.body), function(err, user) {
      if (err){ console.log(err); return res.status(500).send(err); }
      
      return res.format({
        json: function(){
          return res.json("OK"); 
        }
      });
    });
});

router.post('/', function(req, res) {
  
  var user = new User();
  
  
  _.assign(user, req.body.user || req.body);
  
  user.token = jwt.sign(user, process.env.JWT_SECRET);

  user.save(function(err,user) {
    
    if (err) { return res.status(500).json(err); }
    
    User.findById(user._id)
    .populate('avatar')
    .exec(function(err, user) {
      if (err) { return res.status(500).json(err); }
      
      
      return res.format({
        json: function(){
          var response = {}
          _.assign(response, user._doc);
          console.log(response);
          return res.json(response);
        }
      });
      
   });
    
  });
});

router.post('/login', function(req, res) {
  User.findById(req.body._id, function(err, user) {
    return res.format({
      json: function(){
        if(user.facebookId == req.body.facebookId) {
          user.token = jwt.sign(user, process.env.JWT_SECRET);
          user.save(function(err, user1) {
            var response = {}
            _.assign(response, user._doc);
            return res.json(response);
          });
        } else {
          return res.status(400).json({message: "Invalid Username or Password"});
        }
      }
    });
  })
});

module.exports = router;
