var express = require('express');
var router = express.Router();
var Product     = require('../app/models/product');

/* GET home page. */
router.use(function(req, res, next) {
    // do logging
    console.log('Something awful is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  Product.find(function(err, products) {
    if (err)
      res.send(err);

    res.json(products); 
  });
});

router.post('/', function(req, res) {
  var product = new Product();      // create a new instance of the Bear model
  
  product.name = req.body.name;  // set the bears name (comes from the request)


  product.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Product created!' });
  });
})

module.exports = router;
