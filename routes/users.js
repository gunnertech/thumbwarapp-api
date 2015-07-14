var express = require('express');
var router = express.Router();
var User     = require('../app/models/user');
var Product     = require('../app/models/product');
var Useage     = require('../app/models/useage');
var _ = require('lodash');
var jwt        = require("jsonwebtoken");

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find(function(err, users) {
    if (err){ res.send(err); return; }

    res.format({
      html: function(){
        res.render('users/index', { users: users })
      },

      json: function(){
        res.json(users);
      }
    });
  });
});

router.get('/:user_id', function(req, res) {
  // var query = {'username':req.params.username};
  // User.findOneAndUpdate(query, {password: 'iPo0220!$'}, {upsert:true}, function(err, doc){
  // });
  
  
  
    User.findById(req.params.user_id, function(err, user) {
      if (err) res.send(err);

      res.format({
        html: function(){
          Product.find({user: user}, function(err,products) {
            if (err){  res.send(err); return; }
            Useage.find({user: user}).populate('product').exec(function(err,useages) {
              if (err){  res.send(err); return; }
              
              res.render('users/show', { user: user, products: products, useages: useages});
            })
          })
        },

        json: function(){
          res.json(store);
        }
      });
    });
});

router.delete('/:user_id', function(req, res) {
  User.findByIdAndRemove(req.params.user_id, function(err) {
    if (err) res.send(err);

    res.format({
      html: function(){
        res.redirect('/users')
      },

      json: function(){
        res.json({});
      }
    });

  });

});

router.post('/', function(req, res) {
  var user = new User();
  
  
  _.assign(user, req.body.user || req.body);

  user.save(function(err) {
    
    if (err) { console.log(err); res.status(500).json(err); return; }
    
    res.format({
      html: function(){
        res.redirect('/users')
      },

      json: function(){
        res.json(user);
      }
    });
  });
});

router.post('/login', function(req, res) {
  User.findOne({ username: req.body.username }, function(err, user) {
    
    if (err) { res.status(500).json(err); return; }
    
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (err) { res.status(500).json(err); return; }
      
      res.format({
        html: function(){
          res.redirect('/users')
        },

        json: function(){
          if(isMatch) {
            user.token = jwt.sign(user, process.env.JWT_SECRET);
            user.save(function(err, user1) {
              var response = {}
              _.assign(response, user1);
              
              res.json(response);
            });
          } else {
            res.json({message: "Invalid Username or Password"});
          }
        }
      });
    });
  });
});

module.exports = router;
