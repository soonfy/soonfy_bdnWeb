var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var debug = require('debug')('bdn_website:server');

var mongoose = require('mongoose')            //connect mongodb
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)        //insert session to mongodb
var flash = require('connect-flash')          //store info in session

var routes = require('./routes/index');

var app = express();

app.locals.moment = require('moment')

// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'ejs');

//flash store info
app.use(flash())

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

//connect mongodb
// var dburl = 'mongodb://normal:Joke123@ant09.idatage.com:27021/tarantula'
var dburl = 'mongodb://localhost/baidu_news'
mongoose.connect(dburl)
mongoose.set('debug', true)             //mongo debug

//insert session to mongodb
//session config before route config
app.use(session({
  secret: 'baidunews_users',
  key: 'baidu_news',
  cookie: {maxAge: 1000 * 60 * 60 * 24},
  restore: false,
  saveUninitialized: true,
  store: new mongoStore({
    url: dburl,
    collections: 'sessions'
  })
}))

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
