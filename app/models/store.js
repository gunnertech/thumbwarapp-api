var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StoreSchema   = new Schema({
  name: String,
  zipCode: String
});

StoreSchema.methods.products = function (done) {
  return this.model('Product').find({store: this}, done);
};

module.exports = mongoose.model('Store', StoreSchema);