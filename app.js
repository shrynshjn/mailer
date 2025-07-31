
const connectDB = require("./config/db");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const { engine } = require('express-handlebars');

const viewRouter = require('./routes/views');
var usersRouter = require('./routes/users');
const emailRouter = require('./routes/emails');
const campaignRouter = require('./routes/campaigns');
const CronService = require('./services/cron');

// Connect to Database
connectDB();

var app = express();

// Handlebars View Engine Setup
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views'),
  helpers: {
    formatDate: (date) => {
      return new Date(date).toLocaleString();
    },
    eq: (a, b) => a === b,
    countSuccess: (sentArray) => {
      if (!sentArray || !Array.isArray(sentArray)) return 0;
      return sentArray.filter(s => s.success).length;
    },
    json: (context) => {
      return JSON.stringify(context);
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View Routes
app.use('/', viewRouter);

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/emails', emailRouter);
app.use('/api/campaigns', campaignRouter);

// Initialize cron jobs for pending campaigns on startup
CronService.initializeJobs();

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
