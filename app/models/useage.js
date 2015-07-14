var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UseageSchema   = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  opacity: { type: Number, max: 1, min: 0 },
  colorHexCode: String,
  datetime: { type: Date, default: Date.now }
});

UseageSchema.virtual('value').get(function () {
  return this.colorHexCode || this.opacity;
});


module.exports = mongoose.model('Useage', UseageSchema);