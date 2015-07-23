var express = require('express');
var router = express.Router();
var Product     = require('../app/models/group');
var Group     = require('../app/models/group');
var User     = require('../app/models/user');
var _ = require('lodash');
var currentUser = null;

router.use(function(req, res, next) {
  // console.log(req.body);
  next();
});

router.use(function(req, res, next) {
  if(req.query && req.query.token) {
    User.find({token: req.query.token})
    .limit(1)
    .exec(function(err,users){
      if(err){ console.log(err); throw err; } 
      if(req.body) {
          req.body.user = users[0];
      }
      currentUser = users[0];
      next();
    })
  } else {
    next();
  }
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  var queryParams = {};
  var validKeys = [];
  
  if(currentUser) {
    queryParams.user = currentUser;
  }
  
  _.forEach(validKeys, function(key) {
    if (typeof(req.query[key]) != "undefined") {
      queryParams[key] = req.query[key]
    }
  });
  
  Group.find(queryParams)
  .sort({name: -1})
  .exec(function(err, groups) {
    
    if (err) { console.log(err); res.status(500).json(err); return; }
        
    res.json({groups: groups}); 
    
  });
});

router.get('/:group_id', function(req, res) {
  Group.findById(req.params.group_id)
  .exec(function(err, group) {
      if (err){ res.send(err); return; }
      
      Product.find({group: group})
      .exec(function(err,products) {
        if (err){  res.status(500).send(err); return; }
        group.products = products;
        res.format({
          json: function(){
            res.json(group); 
          }
        });
      });
    });
});

router.put('/:group_id', function(req, res) {
  Group.findOneAndUpdate({_id: req.params.group_id},(req.body.group || req.body), {upsert:true}, function(err, group) {
      if (err){ res.send(err); return; }
      
      res.format({
        json: function(){
          res.json("OK"); 
        }
      });
    });
});


router.post('/', function(req, res) {
  var group = new Group();
  
  _.assign(group, req.body.group || req.body);
  

  group.save(function(err) {
    if (err){ console.log(err); res.status(500).send(err); return; }
    
    res.format({
      json: function(){
        res.json(group);
      }
    });
  });
});

router.delete('/:group_id', function(req, res) {
  Group.find({_id: req.params.group_id, user: currentUser})
  .remove(function(err) {
    
    if (err){ console.log(err); res.status(500).send(err); return; }

    res.format({
      json: function(){
        res.json({});
      }
    });
    
  });
  
});

module.exports = router;
