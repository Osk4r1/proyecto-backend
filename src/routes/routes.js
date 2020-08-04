const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');
const { database } = require('firebase-admin');
const passport = require('passport');
var createError = require('http-errors')

var serviceAccount = require('../../proyecto-backend-f27fb-firebase-adminsdk-4ss7w-101e32eba4.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://proyecto-backend-f27fb.firebaseio.com/'
    });
}

const db = admin.database(); 



router.get('/', (req, res) => {
    res.send('Hello world');
})

router.post('/api/new-user', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json({email: 'fail'}); }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json(req.user);
      });
    })(req, res, next);
});


router.post('/api/login', function(req, res, next) {
  passport.authenticate('local-signin', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.json({email: 'fail'}); }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(req.user);
    });
  })(req, res, next);
});



router.post('/api/info-user', async (req, res) => {

    const ref = db.ref('users').orderByChild('email').equalTo(req.body.email);
    const snapshot = await ref.once('child_added');
    const data = snapshot.val();

    res.json(data);
})

router.post('/api/update', async (req, res) => {
  const updateUser = req.body;

  console.log(updateUser)

  var updates = {}

  const ref = db.ref('users').orderByChild('email').equalTo(req.body.email);
  const snapshot = await ref.once('child_added');
  const key = snapshot.key;

  updates['/users/'+key+'/name'] = updateUser.name;
  updates['/users/'+key+'/lastname'] = updateUser.lastname;
  updates['/users/'+key+'/cedula'] = updateUser.cedula;
  updates['/users/'+key+'/age'] = updateUser.age;
  const userActualizado = await db.ref().update(updates);

  const ref2 = db.ref('users').orderByChild('email').equalTo(req.body.email);
  const snapshot2 = await ref2.once('child_added');
  const user = snapshot2.val();


  console.log(user)
  res.json(user)

})

router.post('/api/pago', async (req, res) =>{
  const updateUser = req.body;

  console.log(updateUser)

  var updates = {}

  const ref = db.ref('users').orderByChild('email').equalTo(req.body.email);
  const snapshot = await ref.once('child_added');
  const key = snapshot.key;
  const data = snapshot.val();

  var nuevoSaldo = parseFloat(data.saldo) + parseFloat(updateUser.saldo);


  updates['/users/'+key+'/saldo'] = nuevoSaldo;
  const userActualizado = await db.ref().update(updates);

  const ref2 = db.ref('users').orderByChild('email').equalTo(req.body.email);
  const snapshot2 = await ref2.once('child_added');
  const user = snapshot2.val();
  console.log(user)
  res.json(user)
} )




router.get('/api/logout', (req, res) => {
  req.logout();
  res.json({status: 'logout'})
})

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
}


module.exports = router;