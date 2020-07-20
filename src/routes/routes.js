const { Router } = require('express');
const router = Router();

//const {saveUser} = require('../controller/userController');
const passport = require('passport');

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

router.post('/api/login', passport.authenticate('local-signin', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash : true 
}))

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/')
  }


module.exports = router;