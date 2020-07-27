const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');
const { database } = require('firebase-admin');
const passport = require('passport');

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

router.post('/api/new-user',  passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router.get('/api/info-user', (req, res) => {
    const id = req.body.id;

    db.ref('users').once('value', (snapshot) => {
        const data = snapshot.val();
        res.send(data);
    })
})

router.post('/api/login', passport.authenticate('local-signin'), (req, res) => {
    res.send(req.user);
})

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
}


module.exports = router;