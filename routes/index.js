var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var collection = db.get('articles');
var lib = require('../public/javascripts/lib.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  collection.find({}, function(err, records) {
    res.render('index', { pageTitle: 'The Zine', allArticles: records });
  });
});

router.get('/styleguide', function(req, res, next) {
  res.render('styleguide', {pageTitle: 'The Zine'});
});

// create new article
router.get('/new-article', function(req, res, next) {
  res.render('new-article', {pageTitle: 'The Zine'});
});

// post new article, redirect to home
router.post('/new-article', function(req, res, next) {
  var title = req.body.title;
  var url = req.body.url;
  var dark = req.body.dark;
  var excerpt = req.body.excerpt;
  var body = req.body.body;

  if ((title && excerpt) && body) {
    collection.insert({title: title, url: url, dark: dark, excerpt: excerpt, body: body});
    res.redirect('/');
  } else {
    var errors = lib.errorGen(title, excerpt, body);
    res.render('new-article', {pageTitle: "The Zine", errors: errors, title: title, url: url, dark: dark, excerpt: excerpt, body: body});
  }
});

// show edit article page
router.get('/article/:id/edit', function(req, res, next) {
  collection.findOne({_id: req.params.id}, function(err, record) {
    res.render('edit', {pageTitle: "The Zine", theArticle: record});
  });
});

// article show page
router.get('/article/:id', function(req, res, next) {
  collection.findOne({_id: req.params.id}, function(err, record) {
    res.render('show', {pageTitle: "The Zine", theArticle: record});
  });
});

// post updates to database
router.post('/article/:id', function(req, res, next) {
  var title = req.body.title;
  var url = req.body.url;
  var dark = req.body.dark;
  var excerpt = req.body.excerpt;
  var body = req.body.body;
  if ((title && excerpt) && body) {
    collection.update({_id: req.params.id}, {title: title, url: url, dark: dark, excerpt: excerpt, body: body});
    res.redirect('/article/' + req.params.id);
  } else {
    var errors = lib.errorGen(title, excerpt, body);
    collection.findOne({_id: req.params.id}, function(err, record) {
      res.render('edit', {pageTitle: "The Zine", theArticle: record, errors: errors});
    });
  }
});

//delete article
router.post('/delete/:id', function(req, res, next) {
  collection.remove({_id: req.params.id});
  res.redirect('/');
});


module.exports = router;
