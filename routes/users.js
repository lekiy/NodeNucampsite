const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('../models/user');
const authenticate = require('../authenticate');

const router = express.Router();

const jsonParser = bodyParser.json();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', jsonParser, (req, res, next) => {
    User.register(
      new User({username: req.body.username}),
      req.body.password,
      err => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err, err});
        }else{
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration succesful!'});
          });
        }
      }
    );
});

router.post('/login', jsonParser, passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
    }
});

router.get('/test'), (req, res, next) => {
  res.end(req.toString());
}

module.exports = router;