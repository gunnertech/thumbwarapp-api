var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var swig = require('swig');
var methodOverride = require('method-override');
var auth = require('basic-auth')

mongoose.Promise = require('bluebird');


/*** ROUTES ****/
// var routes = require('./routes/index');
var users = require('./routes/users');
var followings = require('./routes/followings');
var thumbwars = require('./routes/thumbwars');
var activities = require('./routes/activities');
var comments = require('./routes/comments');
var sidings = require('./routes/sidings');
var devices = require('./routes/devices');
var reports = require('./routes/reports');

/*** MODELS ****/
var User = require('./app/models/user');

var app = express();


app.set('view cache', process.env.stage === 'production');
swig.setDefaults({ cache: process.env.stage === 'production' });

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

// app.use(function(req, res, next) {
//     var credentials = auth(req);
//
//     res.format({
//       html: function(){
//         if (typeof credentials == 'undefined' || credentials['name'] != process.env.USERNAME || credentials['pass'] != process.env.PASSWORD) {
//           res.statusCode = 401;
//           res.setHeader('WWW-Authenticate', 'Basic realm="thumbwarapp"');
//           res.end('Unauthorized');
//         } else {
//           next();
//         }
//       },
//
//       json: function(){
//         next();
//       }
//     });
// });

app.use(function(req, res, next) {
  if(req.query && req.query.authToken) {
    User.findByToken(req.query.authToken,function(err,user){
      
      if(err){ next(err); }
      else {
        req.currentUser = user;
        delete req.query.authToken  
        next(); 
      }
    });
  } else {
    next();
  }
});


app.use(function(req, res, next) {
  if(req.body) {
    for(var i in req.body) {
      if(req.body[i] === "") {
        delete req.body[i];
      }
    }
  }
  
  next();
});

function parseMe(req, res, next) {
  if(req.params && req.params.userId == 'me') {
    req.me = true;
    req.params.userId = req.currentUser._id;
    console.log("########### GOT ME");
  }
  next();
}

function parseThumbwar(req, res, next) {
  if(req.params && req.params.thumbwarId) {
    req.query.thumbwarId = req.params.thumbwarId;
    req.body.thumbwar = req.params.thumbwarId;
  }
  next();
}

app.use('/comments', comments);
app.use('/users', users);
app.use('/followings', followings);

app.use('/:userId/followings', followings);
app.use('/:userId/thumbwars', [parseMe,thumbwars]);
app.use('/:userId/activities', [parseMe,activities]);
app.use('/:userId/sidings', [parseMe,sidings]);

app.use('/devices', devices);
app.use('/reports', reports);
app.use('/thumbwars', thumbwars);
app.use('/thumbwars/:thumbwarId/comments', [parseThumbwar,comments]);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (true || app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err.stack)
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/thumbwarapp');


module.exports = app;
