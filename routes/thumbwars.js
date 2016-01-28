var express = require('express');
var router = express.Router();
var User = require('../app/models/user');
var Thumbwar = require('../app/models/thumbwar');
var Following = require('../app/models/following');
var Siding = require('../app/models/siding');
var _ = require('lodash');
var mongoose     = require('mongoose');

// function convertDateToUTC(date) {
//     return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
// }

var parseFollowers = function(req, res, next) {
  var filter = req.query.filter;
  
  delete req.query.filter;
  
  switch(filter){
  case "friends":
    Following.find({followee: req.currentUser}).exec()
    .then(function(followings){
      req.query.creator = {
        $in: _.map(followings,function(following){ return following.follower; })
      }
      next();
    });
    break;
  case "won":
    if(req.query.creator) {
      req.query.outcome = "won";
      next();
    } else if(req.query.subject) {
      req.query.outcome = "lost";
      next();
    } else if(req.query.sided) {
      Siding.find({user: req.query.sided, didWin: true}).exec()
      .then(function(sidings){
        req.query.sidings = {
          $in: sidings
        }
        next();
      });
    }
    break;
  case "lost":
    if(req.query.creator) {
      req.query.outcome = "lost";
      next();
    } else if(req.query.subject) {
      req.query.outcome = "won";
      next();
    } else if(req.query.sided) {
      Siding.find({user: req.query.sided, didWin: false}).exec()
      .then(function(sidings){
        req.query.sidings = {
          $in: sidings
        }
        next();
      });
    }
    break;
  case "inProgress":
    req.query.outcome = {
      $nin: ["won","lost"]
    }
    next();
    break;
  case "all":
    next();
    break;
  default:
    next();
    break;
  }
}


var parseGetQuery = function (req, res, next) {
  if(req.query.pagination) {
    var pagination = req.query.pagination;
    delete req.query.pagination
    
    if(pagination.olderThan) {
      req.query.createdAt = {
        $lt: new Date(pagination.olderThan)
      }
    } else if(pagination.newerThan) {
      req.query.createdAt = {
        $gt: new Date(pagination.newerThan)
      }
    }
  }
  
  
  
  if(req.query.subject) {    
    req.query.creator = {
      $ne: req.query.subject
    }
  } else if(req.query.sided) {
    req.query.siders = {
      $in: [req.query.sided]
    };
    delete req.query.sided;
  }
  
  next();
  
  
};

router.get('/', [parseFollowers,parseGetQuery,function(req, res) { 
  Thumbwar.find(req.query)
  .populate('creator')
  .populate('subject')
  .populate('sidings')
  .sort({createdAt: 'desc'})
  .limit(10)
  .exec()
  .then(function(thumbwars){
    res.json(thumbwars)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
}]);

router.get('/subjects', [parseFollowers,parseGetQuery,function(req, res) { 
  Thumbwar.aggregate([
    {
      $match: {
        subject: null
      }
    },
    {
      $group: {
        _id: "subjectText",
        count: { $sum: 1 }
      }
    },
    { 
      $sort : { 'count' : 1 }
    }
  ],function (err, result) {
    if (err) {
    console.log(err)
    res.json(err)
    } else {
      res.json(result);
    }
  });
}]);

router.get('/:thumbwarId', function(req, res) {  
  Thumbwar.findById(req.params.thumbwarId)
  .populate('creator')
  .populate('subject')
  .populate('sidings')
  // .populate({
  //   path: 'sidings',
  //   populate: {
  //     path: 'user',
  //     model: User
  //   }
  // })
  .exec()
  .then(function(thumbwar){
    return User.populate(thumbwar,{
      path: 'sidings.user'
    });
  })
  .then(function(thumbwar){
    console.log(thumbwar)
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
});

router.put('/:thumbwarId', function(req, res) {
  Thumbwar.findOneAndUpdate({_id: req.params.thumbwarId }, req.body, {'new':true})
  .populate('creator')
  .populate('subject')
  .populate('sidings')
  .populate('sidings.user')
  .exec()
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
});


router.post('/', function(req, res) {
  if(req.me) {
    req.body.creator = req.currentUser;
  }
  Thumbwar.create(req.body)
  .then(function(thumbwar){
    res.json(thumbwar)
  })
  .then(undefined, function (err) {
    console.log(err);
    res.status(500).json(err)
  });
});

module.exports = router;
