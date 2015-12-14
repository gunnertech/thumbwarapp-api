var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var _ = require('lodash');
var jwt = require("jsonwebtoken");
var sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY)
var uuid = require('node-uuid')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = {};
  
  if(req.query) {
    params = req.query;
    
    delete params.token;
  }
  
  
  User.find(params)
  .populate('avatar')
  .exec(function(err, users) {
    if (err) { return res.send(err); }

    return res.format({
      json: function() {
        return res.json(users);
        
      }
    });
  });
});



router.get('/:user_id', function(req, res) {
  User.findById(req.params.user_id)
  .populate('avatar')
  .exec(function(err, user) {
      if (err) return res.send(err);
      return res.format({
        json: function(){
          return res.json(store);
        }
      });
    });
});


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

  user.save(function(err,user) {
    
    if (err) { return res.status(500).json(err); }
    
    User.findById(user.id)
    .populate('avatar')
    .exec(function(err, user) {
      if (err) { return res.status(500).json(err); }
      
      user.token = jwt.sign(user, process.env.JWT_SECRET);
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

module.exports = router;
