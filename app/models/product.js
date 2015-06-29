var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductSchema   = new Schema({
  upc: String,
  name: String,
  type: String,
  store: String,
  zip: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);