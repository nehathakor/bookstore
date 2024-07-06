const express = require("express");
const app = express();
const path = require('path');
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const methodOverride = require("method-override");
const axios = require('axios');
connectDb();

var Publishable_Key = 'pk_test_51PYoe82K1SLOQ2Nqh4yTyjb087nrLNwzje5BkawAwGJ6x66BAUwDN7B9nISRebqHxToO2YBFnfhH7PVNvk67QbVt008KWzHytW'
var Secret_Key = 'sk_test_51PYoe82K1SLOQ2NqvVFfndiScDbbikYJhX19Gl9et2kszlnKLCVdbFxBlZ9yoCcVSNH0e8MoLbGMErX2yBNMZylU00cxunDEgy'
 
const stripe = require('stripe')(Secret_Key)

const PORT = process.env.PORT || 3001;

const session = require('express-session');
const passport = require('passport');
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const flash = require('connect-flash'); 
const { isLoggedIn } = require("./controllers/auth");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

app.post('/create-checkout-session', async (req, res) => {
    const { amount, description } = req.body;

    if (!amount) {
        return res.status(400).send('Amount is required');
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: description,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/cancel`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/success', (req, res) => {
    res.redirect('/success');
});

app.get('/cancel', (req, res) => {
    res.send("Payment Cancelled.");
});



app.use(flash()); 
app.use((req, res, next) => {
    res.locals.error = req.flash('error') || null;
    next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/home',isLoggedIn, (req, res) => {
    res.render('home');
});
app.use('/', require('./routes/staticRouter'));
app.use('/auth', require('./routes/auth'));
app.use('/book', require('./routes/book'));

app.listen(PORT, (err) => {
    console.log(`App is listening on port ${PORT}`);
});
