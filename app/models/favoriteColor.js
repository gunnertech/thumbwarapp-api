var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FavoriteColorSchema   = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  colorHexCode: String,
  datetime: { type: Date, default: Date.now }
});


module.exports = mongoose.model('FavoriteColor', FavoriteColorSchema);