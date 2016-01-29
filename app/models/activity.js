var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var apn = require('apn');
var _ = require('lodash');

var ActivitySchema   = new Schema({
  wasViewed: {type: Boolean, required: true, default: false},
  wasOpened: {type: Boolean, required: true, default: false},
  isAnonymous: {type: Boolean, required: true, default: false},
  body: {type: String, required: true},
  pushBody: {type: String},
  activitableType: {type: String, required: true},
  activitableId: Schema.Types.ObjectId,
  data: Schema.Types.Mixed,
  target: {type: Schema.Types.ObjectId, ref: 'User'},
  object: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

ActivitySchema.post('save', function(doc) {
  var Device = require('./device');
  
  if(!doc.target){ return; }
  
  mongoose.model('Activity', ActivitySchema).count({target: doc.target, wasViewed: false}).exec()
  .then(function(count){
    Device.find({user: doc.target }).exec()
    .then(function(devices){

      _.each(devices,function(device){
        var pfx = new Buffer(process.env.APNS_P12_CONTENTS, 'base64');
        var apnConnection = new apn.Connection({
          pfx: pfx,
          production: (process.env.NODE_ENV == "production"),
          passphrase: process.env.APNS_PASSPHRASE
        });
        
        var note = new apn.Notification();
        var icon = "\uD83C\uDFC6";
      
        if(doc.activitableType == "User") {
          icon = "\uD83D\uDC49"
        }

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = count;
        note.sound = "ping.aiff";
        note.alert = icon + " " + (doc.pushBody || doc.body);
        // note.payload = doc.toObject();
        

        apnConnection.pushNotification(note, (new apn.Device(device.token)));
        
        
      });
    });
    
  });    
});


module.exports = mongoose.model('Activity', ActivitySchema);