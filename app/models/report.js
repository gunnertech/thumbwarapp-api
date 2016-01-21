var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ReportSchema   = new Schema({
  reporter: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  comment: {type: Schema.Types.ObjectId, ref: 'Comment'},
  thumbwar: {type: Schema.Types.ObjectId, ref: 'Thumbwar'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});



module.exports = mongoose.model('Report', ReportSchema);