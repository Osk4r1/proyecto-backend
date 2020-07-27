const express = require('express');
const app = express();
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');

require('./passsport/local-auth');

//Settings
app.set('port', process.env.PORT || 4000);
app.set('json spaces', 2);

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
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


//Routes 
app.use(require('./routes/routes'));


//Starting the server 
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});