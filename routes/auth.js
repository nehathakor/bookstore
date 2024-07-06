const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const { isLoggedIn } = require('../controllers/auth');


router.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('signup', { error: 'Passwords do not match' });
    }

    User.register(new User({ username, email }), password, (err, user) => {
        if (err) {
            return res.render('signup', { error: 'Error creating user. Please try again.' });
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/home'); 
        });
    });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',  
    failureRedirect: '/auth/login',
    failureFlash: true
}));


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/', (req, res) => {
    res.render('signup');
});

router.get('/logout',isLoggedIn, (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;
