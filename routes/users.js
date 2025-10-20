var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('form', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  res.render('user_home', { title: 'Express',activePage: 'home'});
});

router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Express',activePage: 'form'});
});

router.get('/history', function(req, res, next) {
  res.render('history', { title: 'Express',activePage: 'history'});
});

router.get('/profile', function(req, res, next) {
  res.render('profile_user', { title: 'Express', activePage: 'profile'});
});

module.exports = router;
