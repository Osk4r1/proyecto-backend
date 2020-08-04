const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const admin = require('firebase-admin');
const { database } = require('firebase-admin');
const bcrypt = require('bcrypt');

var serviceAccount = require('../../proyecto-backend-f27fb-firebase-adminsdk-4ss7w-101e32eba4.json');
const { refund } = require('paypal-rest-sdk');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://proyecto-backend-f27fb.firebaseio.com/'
});

const db = admin.database(); 

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    
    const ref = db.ref('users').orderByChild('email').equalTo(req.body.email);
    const snapshot = await ref.once('value');
    const user = snapshot.val();

    console.log('Imprimiendo usuario de la consulta')
    console.table(user);
    if(user) {
      console.log('entrado al if'); 
      return done(null, false, req.flash('signupMessage', 'El usuario ya existe'));
    }else{
  
      console.log('Entrando al if de registro');
      
      let hash = bcrypt.hashSync(req.body.password, 10);
    
      const newUser = {
          name: '',
          lastname: '',
          email: req.body.email,
          cedula: '',
          age: '',
          saldo: "0",
          password: hash
      }

      console.log('nuevo usuario')
      console.log(newUser)
      db.ref('users').push(newUser);

      done(null, newUser);
    }
  }));
  
  passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {

    let hash = bcrypt.hashSync(req.body.password, 10);
    const ref = db.ref('users').orderByChild('email').equalTo(req.body.email);
    const snapshot = await ref.once('child_added');
    const user = snapshot.val();

    if(!user) {
      return done(null, false, req.flash('signinMessage', 'No User Found'));
    }

    let bandera = bcrypt.compareSync(req.body.password, user.password);
    if(!bandera) {
      return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
    }
    return done(null, user);
  }));

