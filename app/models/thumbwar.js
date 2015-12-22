var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ThumbwarSchema   = new Schema({
  isPrivate: { type: Boolean, required: true, default: false },
  isAnonymous: { type: Boolean, required: true, default: false },
  body: { type: String, required: true },
  subjectText: { type: String, required: true },
  assertion: { type: String, required: true, index: true },
  outcome: { type: String, index: true },
  subject: {type: Schema.Types.ObjectId, ref: 'User'},
  creator: {type: Schema.Types.ObjectId, ref: 'User'},
  sidings: [{type: Schema.Types.ObjectId, ref: 'Siding'}],
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


ThumbwarSchema.post('save', function(doc) {
  setTimeout(function(){
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^ddd")
  },4000)
})


module.exports = mongoose.model('Thumbwar', ThumbwarSchema);