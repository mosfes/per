var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const user = require('../models/user');

router.get('/login', function(req, res, next) {
  const errorMessage = req.session.errorMessage; // ดึง error message จาก session
  req.session.errorMessage = null; // เคลียร์ error message ทิ้งหลังจากดึงค่ามาแล้ว
  res.render('login', { 
    title: 'Express', 
    activePage: 'login',
    errorMessage: errorMessage // ส่ง errorMessage ไปให้ EJS
  });
});

router.post('/login', async function(req, res, next) {
  try {
    const { username, password } = req.body; // รับค่า username, password จากฟอร์ม

    // 1. ค้นหาผู้ใช้จาก username ที่กรอกมา (ใช้ .toLowerCase() เพื่อให้ตรงกับ model)
    const foundUser = await user.findOne({ username: username.toLowerCase() }); //

    // 2. ถ้าไม่เจอผู้ใช้
    if (!foundUser) {
      req.session.errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'; // เก็บ error ใน session
      return res.redirect('/login'); // เด้งกลับไปหน้า login
    }

    // 3. ถ้าเจอผู้ใช้: ตรวจสอบรหัสผ่าน
    // ใช้ bcrypt.compare เพื่อเทียบรหัสผ่านที่กรอก (password) กับรหัสผ่านที่เข้ารหัสใน DB (foundUser.password)
    const isMatch = await bcrypt.compare(password, foundUser.password); //

    if (isMatch) {
      // 4. ถ้า รหัสผ่านถูกต้อง: เก็บข้อมูลผู้ใช้ลง session
      req.session.userId = foundUser._id;
      req.session.username = foundUser.username;
      req.session.role = foundUser.role; //
      req.session.firstName = foundUser.first_name; // (เก็บชื่อไว้ด้วยก็ดี)

      // 5. แยกทางไปหน้า Admin หรือ User
      if (foundUser.role === 'admin') { //
        res.redirect('/admin/home'); //
      } else {
        res.redirect('/user/home'); //
      }
    } else {
      // 6. ถ้า รหัสผ่านไม่ถูกต้อง
      req.session.errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      res.redirect('/login');
    }

  } catch (err) {
    next(err);
  }
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