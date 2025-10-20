var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const user = require('../models/user');

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express', activePage: 'login' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express', activePage: 'register' });
});


router.post('/register/add', async function(req, res, next) {
  try {

    const plainPassword = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = new user({
      username: req.body.username,
      first_name: req.body.FirstName,
      last_name: req.body.LastName,
      password: hashedPassword,
      role: 'user'
    });

    if (req.body.password !== req.body.confirmPassword) {
      const Users = await user.find();
      return res.render('register', {
        title: 'สมัครสมาชิก',
        activePage: 'register',
        users: Users,
        errorMessage: 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน กรุณาลองใหม่'
      });
    }
    
    await newUser.save();
    res.redirect('/login');
    
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.username) {
      const Users = await user.find();
      res.render('register', {
        title: 'สมัครสมาชิก',
        activePage: 'register',
        users: Users,
        errorMessage: `ชื่อผู้ใช้ "${req.body.username}" นี้มีคนใช้แล้ว กรุณาลองใหม่`
      });
    } else {  
    next(err);
    }
  }
  });


module.exports = router;