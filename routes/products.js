var express = require('express');
var router = express.Router();
var Product     = require('../app/models/product');
var Store     = require('../app/models/store');
var User     = require('../app/models/user');
var Useage     = require('../app/models/useage');
var _ = require('lodash');

router.use(function(req, res, next) {
  console.log(req.body);
  next();
});

router.use(function(req, res, next) {
  if(req.body && !req.body.store) {
    Store.find({})
    .limit(1)
    .exec(function(err,stores){
      if(err) throw err;
      req.body.store = stores[0];
      next();
    })
  } else {
    next();
  }
});

router.use(function(req, res, next) {
  if(req.body && !req.body.user) {
    User.find({token: req.query.token})
    .limit(1)
    .exec(function(err,users){
      if(err) throw err;
      req.body.user = users[0];
      next();
    })
  } else {
    next();
  }
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  var queryParams = {};
  var validKeys = ['uuid'];
  
  _.forEach(validKeys, function(key) {
    if (typeof(req.query[key]) != "undefined") {
      queryParams[key] = req.query[key]
    }
  });
  
  Product.find(queryParams)
  .populate('store')
  .populate('user')
  .sort({purchaseDate: -1})
  .exec(function(err, products) {
    if (err) { console.log(err); res.status(500).json(err); return; }

    res.format({
      html: function(){
        res.render('index', { products: products })
      },

      json: function(){
        console.log(products)
        res.json({products: products}); 
      }
    });
  });
});

router.get('/new', function(req, res) {
    Product.findById(req.params.product_id)
    .exec(function(err, product) {
      if (err) res.send(err);
      
      Store.find(function(err, stores) {
        if (err) res.send(err);
      
        res.format({
          html: function(){
            res.render('products/new', { product: product, stores: stores })
          }
        });
      })
    });
});

router.get('/:product_id', function(req, res) {
  Product.findById(req.params.product_id)
  .populate('store')
  .exec(function(err, product) {
      if (err){ res.send(err); return; }
      
      Useage.find({product: product}).populate('product').exec(function(err,useages) {
        if (err){  res.send(err); return; }
      
        res.format({
          html: function(){
            res.render('products/show', { product: product, useages: useages })
          },

          json: function(){
            res.json(products); 
          }
        });
      });
    });
});

router.put('/:product_id', function(req, res) {
  Product.findOneAndUpdate({_id: req.params.product_id},(req.body.product || req.body), {upsert:true}, function(err, product) {
      if (err){ res.send(err); return; }
      
      res.format({
        html: function(){
          res.render('products/show', { product: product })
        },

        json: function(){
          res.json("OK"); 
        }
      });
    });
});


router.post('/', function(req, res) {
  var product = new Product();
  
  _.assign(product, req.body.product || req.body);
  

  product.save(function(err) {
    if (err){ console.log(err); res.send(err); return; }
    
    res.format({
      html: function(){
        res.redirect('/products')
      },

      json: function(){
        res.json(product);
      }
    });
  });
});

router.delete('/:product_id', function(req, res) {
  Product.findByIdAndRemove(req.params.product_id, function(err) {
    if (err) res.send(err);

    res.format({
      html: function(){
        res.redirect('/products')
      },

      json: function(){
        res.json({});
      }
    });
    
  });
  
});

module.exports = router;
