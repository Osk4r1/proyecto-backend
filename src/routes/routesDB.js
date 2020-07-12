const { Router } = require('express');
const router = Router();
const admin = require('firebase-admin');
const { database } = require('firebase-admin');

var serviceAccount = require("../../proyecto-backend-f27fb-firebase-adminsdk-4ss7w-101e32eba4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://proyecto-backend-f27fb.firebaseio.com/'
});

const db = admin.database(); 

router.get('/', (req, res) => {
    res.send('Hello world');
})

router.post('/api/new-user', (req, res) => {
    const newUser = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        age: req.body.age,
        saldo: req.body.saldo
    }
    db.ref('users').push(newUser);
    res.send('saved');
})

router.get('/api/info-user', (req, res) => {
    const id = req.body.id;

    db.ref('users').once('value', (snapshot) => {
        const data = snapshot.val();
        res.send(data);
    })
})

module.exports = router;