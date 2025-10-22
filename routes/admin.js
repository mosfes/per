var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

var Location = require('../models/location');
var user = require('../models/user');

router.get('/home', function(req, res, next) {
  res.render('admin_home', { title: 'หน้าแรก',activePage: 'home'});
});

router.get('/work', function(req, res, next) {
  res.render('admin_work', { title: 'งาน',activePage: 'work'});
});

router.get('/history', function(req, res, next) {
  res.render('admin_history', { title: 'ประวัติงาน',activePage: 'history'});
});

router.get('/profile', function(req, res, next) {
  res.render('admin_profile', { title: 'โปรไฟล์',activePage: 'profile'});
});

router.get('/manage', function(req, res, next) {
  res.render('admin_manage', { title: 'จัดการ',activePage: 'manage'});
});



router.get('/buildings', async function(req, res, next) {
  try {
    const locations = await Location.find(); 
    
    res.render('admin_buildings', { 
      title: 'จัดการอาคาร',
      activePage: 'buildings',
      locations: locations 
    });
  } catch (err) {
    next(err);
  }
});


router.post('/buildings/add', async function(req, res, next) {
  try {
    const newLocation = new Location({
      name: req.body.name,
      floor: req.body.floor
    });
    
    await newLocation.save();
    res.redirect('/admin/buildings');
    
  } catch (err) {
    next(err);
  }
});


router.post('/buildings/edit/:id',async function(req, res, next) {
  try {
    const locationId = req.params.id;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).send('Location not found');
    }

    location.name = req.body.name;
    location.floor = req.body.floor;
    await location.save();

    res.redirect('/admin/buildings');

  } catch (err) {
    next(err);
  }
});
router.post('/buildings/delete/:id', async function(req, res, next) {
  try {
    const locationId = req.params.id; 
    await Location.findByIdAndDelete(locationId);
    res.redirect('/admin/buildings');
  } catch (err) {
    next(err);
  }
});

router.get('/equipment', function(req, res, next) {
  res.render('admin_equipment', { title: 'จัดการอุปกรณ์',activePage: 'equipment'});
});

router.get('/users', async function(req, res, next) {
  const allUsers = await user.find();
  const adminUsers = allUsers.filter(u => u.role === 'admin');
  const generalUsers = allUsers.filter(u => u.role === 'user');
  
  res.render('admin_user', { title: 'จัดการผู้ใช้',activePage: 'user', users: allUsers ,generalUsers: generalUsers, adminUsers: adminUsers, errorMessage: null});
});

router.post('/users/add', async function(req, res, next) {
  try {

    const plainPassword = req.body.password;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = new user({
      username: req.body.username,
      first_name: req.body.FirstName,
      last_name: req.body.LastName,
      password: hashedPassword,
      role: req.body.userType
    });
    
    await newUser.save();
    res.redirect('/admin/users');
    
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.username) {
      const Users = await user.find();
      res.render('admin_user', {
        title: 'จัดการผู้ใช้',
        activePage: 'user',
        users: Users,
        errorMessage: `ชื่อผู้ใช้ "${req.body.username}" นี้มีคนใช้แล้ว กรุณาลองใหม่`
      });
    } else {  
    next(err);
    }
  }
  });

  router.post('/users/delete/:id', async function(req, res, next) {
  try {
    const userId = req.params.id; 
    await user.findByIdAndDelete(userId);
    res.redirect('/admin/users');
  } catch (err) {
    next(err);
  }
  });



router.post('/users/edit/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;

    const userUpdate = await user.findById(userId); 

    if (!userUpdate) {
      return res.status(404).send('User not found');
    }

    userUpdate.username = req.body.username;
    userUpdate.first_name = req.body.FirstName;
    userUpdate.last_name = req.body.LastName;
    userUpdate.role = req.body.userType;

    await userUpdate.save();

    res.redirect('/admin/users');

  } catch (err) {
    if (err.code === 11000 && err.keyPattern.username) {
      
      const allUsers = await user.find();
      const adminUsers = allUsers.filter(u => u.role === 'admin');
      const generalUsers = allUsers.filter(u => u.role === 'user');

      res.render('admin_user', {
        title: 'จัดการผู้ใช้',
        activePage: 'user',
        users: allUsers,
        generalUsers: generalUsers,
        adminUsers: adminUsers,
        errorMessage: `ชื่อผู้ใช้ "${req.body.username}" นี้มีคนใช้แล้ว กรุณาลองใหม่`
      });
    } else { 
      next(err);
    }
  }
});

router.post('/users/changepassword/:id', async function(req, res, next) {
  try {
    const userId = req.params.id;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.trim() === '') {
      return res.redirect('/admin/users'); 
    }

    const userToUpdate = await user.findById(userId);
    if (!userToUpdate) {
      return res.status(404).send('User not found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    userToUpdate.password = hashedPassword;
    await userToUpdate.save();

   
    res.redirect('/admin/users');

  } catch (err) {
    next(err);
  }
});

module.exports = router;

