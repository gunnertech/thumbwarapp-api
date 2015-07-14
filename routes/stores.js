var express = require('express');
var router = express.Router();
var Store     = require('../app/models/store');
var _ = require('lodash');
var format = require('date-format');

/* GET home page. */
router.use(function(req, res, next) {
    // do logging
    console.log(req.body);
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  Store.find(function(err, stores) {
    if (err)
      res.send(err);

    res.format({
      html: function(){
        res.render('stores/index', { stores: stores })
      },

      json: function(){
        res.json(stores);
      }
    });
  });
});

router.get('/new', function(req, res) {
  res.format({
    html: function(){
      res.render('stores/new', { store: new Store()})
    }
  });
});

router.get('/:store_id', function(req, res) {
    Store.findById(req.params.store_id, function(err, store) {
      if (err) res.send(err);

      res.format({
        html: function(){
          store.products(function(err,products){
            if (err) res.send(err);
            res.render('stores/show', { store: store, products: products });
          })
        },

        json: function(){
          res.json(store);
        }
      });
    });
});


router.post('/', function(req, res) {
  var store = new Store();
  
  _.assign(store, req.body.store);

  store.save(function(err) {
    if (err)
      res.send(err);
    
    res.format({
      html: function(){
        res.redirect('/stores')
      }
    });
  });
});

router.delete('/:store_id', function(req, res) {
  Store.findByIdAndRemove(req.params.store_id, function(err) {
    if (err) res.send(err);

    res.format({
      html: function(){
        res.redirect('/stores')
      },

      json: function(){
        res.json({});
      }
    });

  });

});

module.exports = router;
