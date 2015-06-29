var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   // res.render('index', { header: 'The index page!' })
  res.redirect('/products');
});

module.exports = router;
