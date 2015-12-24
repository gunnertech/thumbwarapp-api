var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ActivitySchema   = new Schema({
  wasViewed: {type: Boolean, required: true, default: false},
  wasOpened: {type: Boolean, required: true, default: false},
  body: {type: String, required: true},
  activitableType: {type: String, required: true},
  activitableId: Schema.Types.ObjectId,
  data: Schema.Types.Mixed,
  target: {type: Schema.Types.ObjectId, ref: 'User'},
  object: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

ActivitySchema.post('save', function(doc) {
  var Device = require('./device');
  
  Device.find({user: doc.target }).exec()
  .then(function(devices){
    _.each(devices,function(device){
      //send push notification
    });
  });
    
});


module.exports = mongoose.model('Activity', ActivitySchema);