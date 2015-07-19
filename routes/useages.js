var express = require('express');
var router = express.Router();
var Useage     = require('../app/models/useage');
var User       = require('../app/models/user');
var _ = require('lodash');
var jwt        = require("jsonwebtoken");

router.use(function(req, res, next) {
  if(req.query.token && req.body) {
    console.log(req.query.token)
    User.findByToken(req.query.token, function(err,user){
      console.log("HIIII")
      if(err) throw err;
      (req.body.useage || req.body).user = user._id
      console.log("GOT A USER")
      next();
    })
  } else {
    next();
  }
});


router.get('/', function(req, res, next) {
  Useage.find()
  .sort({ datetime: -1 })
  .populate('user')
  .populate('product')
  .exec(function(err, useages) {
    if (err){ res.send(err); return; }

    res.format({
      html: function(){
        res.render('useages/index', { useages: useages })
      },

      json: function(){
        res.json(useages);
      }
    });
  });
});


router.post('/', function(req, res) {
  var useage = new Useage();
  
  _.assign(useage, req.body.useage || req.body);
  console.log("AYYYY GURL")
  console.log(useage)

  useage.save(function(err) {
    
    console.log("OKKKKK")
    console.log(err)
    
    if (err) { console.log(err); res.status(500).json(err); return; }
    
    res.format({
      html: function(){
        res.redirect('/useages')
      },

      json: function(){
        res.json(useage);
      }
    });
  });
});


module.exports = router;
