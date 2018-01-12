var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var moment = require('moment');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var mongo = require('mongodb');
var monk = require('monk');

//require our routes
var index = require('./routes/index');
var about = require('./routes/about');
var blog  = require('./routes/blog');

var app = express();

//monk connection url
var url = 'mongodb://heroku_rmccmj2z:8imor4kqhtosqbp7d90ra71183@ds255347.mlab.com:55347/heroku_rmccmj2z';
var db = monk(url);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('public', path.join(__dirname, 'public'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//express-session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave:true
}));

// express-validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

	while(namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	}
	return{
		param: formParam,
		msg: msg,
		value: value
	};
	}
}));

// connect-flash
app.use(flash());
app.use(function(req,res,next){
	res.locals.messages = require('express-messages')(req,res);
	next();
});

// make our db accessable to our router
app.use(function(req,res,next){
	req.db = db;
	next();
});

// USE OUR ROUTS
app.use('/', index);
app.use('/about', about);
app.use('/blog', blog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
