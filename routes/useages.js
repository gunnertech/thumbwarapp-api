var express = require('express');
var router = express.Router();
var Useage     = require('../app/models/useage');
var _ = require('lodash');
var jwt        = require("jsonwebtoken");

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
  
  //TODO: GET USER FROM TOKEN
  req.body.user = "55a470ba48b83b072ea8de7b"
  //TODO: GET PRODUCT FROM REQUEST
  req.body.product = "55a5339659fbc93ba86b26fc"
  
  _.assign(useage, req.body.useage || req.body);

  useage.save(function(err) {
    
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
