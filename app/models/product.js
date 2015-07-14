var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductSchema   = new Schema({
  upc: String,
  name: String,
  type: String,
  enabled: Boolean,
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  zip: String,
  colorHexCode: String,
  purchaseDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);