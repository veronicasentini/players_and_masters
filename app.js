var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash');
var createError = require('http-errors');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

require('./config/passport');
require('./config/db');

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'mysupersession', 
    resave: false, 
    saveUninitialized: false,
    cookie: {
        expires: 60000
    }}));
app.get('/',function(req,res){

})

//controlla se la session è aperta, se no rimanda alla pagina di login
app.use(function (req, res) {
    if (req.session.user == undefined){
        res.redirect('/');
    }
})

//controlla se il cookie è ancora settato mentre la session è scaduta
app.use(function(req, res, next){
    if(req.cookies.user && !req.session.user){
        res.clearCoockie('user');
    }
})

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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