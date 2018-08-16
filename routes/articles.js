const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
// Bring in the model for articles
let Articles = require('../models/article');
// Bring in the user model
let User = require('../models/user');

router.get('/add', isAuth, (req, res) => {
  res.render('add_article');
});

router.post('/add', [
  check('title').isLength({min: 1}).trim().withMessage('Title required'),
  // check('author').isLength({min: 1}).trim().withMessage('Author required'),
  check('body').isLength({min: 1}).trim().withMessage('Body required')
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render('add_article', {
      title: 'Add Article',
      errors: errors.mapped()
    });
  } else {
    let article = new Articles();
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    article.save((err, article) => {
      if (err) return console.log(err);
      req.flash('success', 'Article added succcessfully!');
      res.redirect('/');
    });
  }
});

router.get('/:id', (req, res) => {
  let id = req.params.id;
  Articles.findById(id, (err, article) => {
    if (err) return console.log(err);
    User.findById(article.author, (err, author) => {
      if (err) return console.log(err);
      res.render('article', {
        article: article,
        author: author
      });
    });
  });
});

router.get('/edit/:id', isAuth, (req, res) => {
  let id = req.params.id;
  Articles.findById(id, (err, article) => {
    if (article.author !== req.user.id) {
      req.flash('danger', 'Not Authorized!');
      res.redirect('/');
      return;
    }
    if (err) return console.log(err);
    res.render('edit', {
      article: article
    });
  });
});

router.post('/edit/:id', (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = {_id: req.params.id};
  Articles.update(query, article, (err) => {
    if (err) return console.log(err);
    req.flash('info', 'Article updated!');
    res.redirect('/');
  });
});

router.delete('/del/:id', (req, res) => {
  let query = {_id: req.params.id};
  Articles.remove(query, (err) => {
    if (err) console.log(err);
    res.send('SUCCESS');
  });
});

function isAuth (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login! ');
    res.redirect('/users/login');
  }
}

module.exports = router;
