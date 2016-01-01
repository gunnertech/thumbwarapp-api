var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var apn = require('apn');
var _ = require('lodash');

var ActivitySchema   = new Schema({
  wasViewed: {type: Boolean, required: true, default: false},
  wasOpened: {type: Boolean, required: true, default: false},
  isAnonymous: {type: Boolean, required: true, default: false},
  body: {type: String, required: true},
  activitableType: {type: String, required: true},
  activitableId: Schema.Types.ObjectId,
  data: Schema.Types.Mixed,
  target: {type: Schema.Types.ObjectId, ref: 'User'},
  object: {type: Schema.Types.ObjectId, ref: 'User'}
},{timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

ActivitySchema.post('save', function(doc) {
  var Device = require('./device');
  
  console.log("~~~~~~~"+doc.target)
  
  Device.find({user: doc.target }).exec()
  .then(function(devices){
    console.log("~~~~~~~"+devices)
    _.each(devices,function(device){
      console.log("~~~~~~~~~ hi there");
      console.log("~~~~~~~~~ ok");
      console.log("~~~~~~~" + process.env.APNS_P12_CONTENTS);
      console.log("~~~~~~~~~ go there");
      
      var pfx = new Buffer(process.env.APNS_P12_CONTENTS, 'base64');

      var apnConnection = new apn.Connection({
        pfx: pfx,
        production: (process.env.NODE_ENV == "production"),
        passphrase: process.env.APNS_PASSPHRASE
      });
        
      var note = new apn.Notification();

      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 3;
      note.sound = "ping.aiff";
      note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
      note.payload = {'messageFrom': 'Caroline'};

      apnConnection.pushNotification(note, (new apn.Device(device.token)));
        
    });
  });
    
});


module.exports = mongoose.model('Activity', ActivitySchema);