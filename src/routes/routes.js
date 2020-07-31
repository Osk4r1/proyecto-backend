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
      if (!user) { return res.json({error: 'Error Registro'}); }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json(req.user);
      });
    })(req, res, next);
});



router.get('/api/info-user', (req, res) => {
    const id = req.body.id;

    db.ref('users').once('value', (snapshot) => {
        const data = snapshot.val();
        res.send(data);
    })
})

/*
router.post('/api/new-user',  passport.authenticate('local-signup'), (req, res)=>{
    res.json({ currentUser: req.user });
});

router.post('/api/login', passport.authenticate('local-signin',{
    failureRedirect: '/UserF'}), (req, res) =>{
        res.json(req.user)
    }
);
*/

router.post('/api/login', function(req, res, next) {
    passport.authenticate('local-signin', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json({error: 'Error login'}); }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json(req.user);
      });
    })(req, res, next);
});


function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
}


module.exports = router;