var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const MongoClient = require('mongodb').MongoClient
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash())
app.use(session({
    secret: 'test secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy({
        passReqToCallback: true,

    },
    (req, username, password, autoCheckDone) => {
        app.locals.users
            .findOne({ username })
            .then(user => {
                if (!user) {
                    return autoCheckDone(null, false, req.flash('error', 'User not found '))
                }

                if (user.password !== password) {
                    return autoCheckDone(null, false, req.flash('error', "Password Incorrect"))
                }

                return autoCheckDone(null, user)
            })
    }
))

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser((id, done) => {
    done(null, { id })
})


app.use('/', indexRouter);
app.use('/users', usersRouter);

MongoClient.connect('mongodb://localhost:27017/blogdb', (err, client) => {
    if (err) throw err;
    const db = client.db('blogdb')
    const collection = db.collection('posts')
    const users = db.collection('users')

    //to share this collection throughout the application
    app.locals.collection = collection;
    app.locals.users = users
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