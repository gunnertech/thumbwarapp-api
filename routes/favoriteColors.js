var express = require('express');
var router = express.Router();
var FavoriteColor     = require('../app/models/favoriteColor');
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
  
  FavoriteColor.find(queryParams)
  .sort({datetime: -1})
  .populate('user')
  .exec(function(err, favoriteColors) {
    
    if (err) { console.log(err); res.status(500).json(err); return; }
        
    res.json({favoriteColors: favoriteColors}); 
    
  });
});

router.delete('/:favoriteColor_id', function(req, res) {
  FavoriteColor.find({_id: req.params.favoriteColor_id, user: currentUser})
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
