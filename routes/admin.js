var express = require('express');
var router = express.Router();

router.get('/home', function(req, res, next) {
  res.render('admin_home', { title: 'Express',activePage: 'home'});
});

router.get('/work', function(req, res, next) {
  res.render('admin_work', { title: 'Express',activePage: 'work'});
});

router.get('/history', function(req, res, next) {
  res.render('admin_history', { title: 'Express',activePage: 'history'});
});

router.get('/profile', function(req, res, next) {
  res.render('admin_profile', { title: 'Express',activePage: 'profile'});
});

router.get('/manage', function(req, res, next) {
  res.render('admin_manage', { title: 'Express',activePage: 'manage'});
});

router.get('/buildings', function(req, res, next) {
  res.render('admin_buildings', { title: 'Express',activePage: 'buildings'});
});

router.get('/equipment', function(req, res, next) {
  res.render('admin_equipment', { title: 'Express',activePage: 'equipment'});
});

module.exports = router;