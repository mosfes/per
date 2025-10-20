var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var MongoStore = require('connect-mongo');

var mongoose = require('mongoose');
require('dotenv').config(); 

var indexRouter = require('./routes/users');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var loginRouter = require('./routes/login');

var app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.use(session({
  secret: process.env.SESSION_SECRET, // ดึงค่ามาจากไฟล์ .env
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions' 
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // Cookie มีอายุ 1 วัน
  }
}));

app.use((req, res, next) => {
  res.locals.session = req.session; // ทำให้ใน .ejs สามารถเรียกใช้ตัวแปร `session` ได้
  next();
});

const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) { // ถ้าใน session ไม่มี userId
    return res.redirect('/login'); // ให้เด้งกลับไปหน้า login
  }
  next(); // ถ้ามี ไปต่อได้
};

const isAdmin = (req, res, next) => {
  if (req.session.role !== 'admin') { 
    return res.redirect('/user/home'); 
  }
  next(); 
};


app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/user', isAuthenticated,usersRouter);
app.use('/admin', isAuthenticated,adminRouter);
app.use('/', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
