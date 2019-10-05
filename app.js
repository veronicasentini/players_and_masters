var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash');
var errors = require('express-validator-errors');

var createError = require('http-errors');


/*const userController = require('./controller/userController');*/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const sqllite3 = require('./controller/db');


app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'mysupersession', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/user', usersRouter);

//controlla se la session è aperta, se no rimanda alla pagina di login
app.use(function(req, res) {
    if (req.session.user == undefined) {
        res.redirect('/');
    }
})

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