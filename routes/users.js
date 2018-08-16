const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Bring in the user model
let User = require('../models/user');

// Register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Register process
router.post('/register', [
  check('name', 'Name is required').exists({checkNull: true, checkFalsy: true}),
  check('email', 'Email is invalid').isEmail(),
  check('username', 'Username is required').exists({checkNull: true, checkFalsy: true}),
  check('password', 'Password is required').exists({checkNull: true, checkFalsy: true})
], body('password2', 'Passwords do not match.').custom((value, {req}) => value === req.body.password)
, (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('register', {
      errors: errors.mapped()
    });
  } else {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
    // Hashing the password
    bcrypt.genSalt(10, (errors, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) return console.log(err);
        newUser.password = hash;
        newUser.save((err, user) => {
          if (err) return console.log(err);
          req.flash('success', 'You are now registered and login');
          res.redirect('/users/login');
        });
      });
    });
  }
});

// Login router
router.get('/login', (req, res) => {
  res.render('login');
});

// Login process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout user
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'You are logged out!');
  res.redirect('/users/login');
});

module.exports = router;
