var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
const MongoStore = require('connect-mongo');
const {v4 : uuidv4} = require('uuid')
const { mongoUrl } = require('./config');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl:mongoUrl }),
  genid: function(req) {
    return uuidv4() // use UUIDs for session IDs
  }
}
 
app.use(session(sess))

app.use(function (req, res, next) {
  if(req.session.user) {
    app.locals.loggedIn = true;
  } else {
    app.locals.loggedIn = false;
  }

  next();
})

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', usersRouter);

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
