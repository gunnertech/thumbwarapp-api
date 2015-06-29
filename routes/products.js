var express = require('express');
var router = express.Router();
var Product     = require('../app/models/product');
var _ = require('lodash');

/* GET home page. */
router.use(function(req, res, next) {
    // do logging
    console.log(req.body);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  Product.find(function(err, products) {
    if (err)
      res.send(err);

    res.format({
      html: function(){
        res.render('index', { products: products })
      },

      json: function(){
        res.json(products); 
      }
    });
  });
});

router.get('/new', function(req, res) {
    Product.findById(req.params.product_id, function(err, product) {
      if (err)
        res.send(err);
      
      res.format({
        html: function(){
          res.render('products/new', { product: product })
        }
      });
    });
});

router.get('/:product_id', function(req, res) {
    Product.findById(req.params.product_id, function(err, product) {
      if (err)
        res.send(err);
      
      res.format({
        html: function(){
          res.render('products/show', { product: product })
        },

        json: function(){
          res.json(products); 
        }
      });
    });
});


router.post('/', function(req, res) {
  var product = new Product();
  
  _.assign(product, req.body.product);

  product.save(function(err) {
    if (err)
      res.send(err);
    
    res.format({
      html: function(){
        res.redirect('/products')
      },

      json: function(){
        res.json({ message: 'Product created!' });
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
