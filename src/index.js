const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const createError = require('http-errors')
const errorHandler = require('errorhandler');


require('./passsport/local-auth');

//Settings
app.set('port', process.env.PORT || 4000);
app.set('json spaces', 2);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true})); // support encoded bodies
app.use(methodOverride());
app.use(cookieParser());
app.use(express.json());
app.use(flash())
app.use(session({
    secret: '$sdasd12398767asd2123',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(errorHandler());

//Routes 
app.use(require('./routes/routes'));

//Errors
  /*
app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    //res.render('error');
});
*/

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
    });
   
app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    //res.render('error');
    next();
});

//Starting the server 
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});