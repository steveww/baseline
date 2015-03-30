var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { 'title': 'Baseline' });
});

// About
router.get('/graph', function(req, res, next) {
  res.render('graph', { 'title': 'Graph' });
});

module.exports = router;
