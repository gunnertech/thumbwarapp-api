var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProductSchema   = new Schema({
  upc: { type: String, required: true, index: { unique: true } },
  uuid: { type: String, required: true, index: { unique: true } },
  name: String,
  type: String,
  enabled: Boolean,
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store'
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
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