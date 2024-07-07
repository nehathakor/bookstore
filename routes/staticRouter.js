const express = require("express")
const router = express.Router();
const Book = require("../models/book");
const { isLoggedIn } = require('../controllers/auth');
var Publishable_Key = 'pk_test_51PYoe82K1SLOQ2Nqh4yTyjb087nrLNwzje5BkawAwGJ6x66BAUwDN7B9nISRebqHxToO2YBFnfhH7PVNvk67QbVt008KWzHytW'

router.get("/",(req,res)=>{
    res.render("signup")
})

router.get("/addbook",(req,res)=>{
    res.render("addbook")
})

router.get("/login",(req,res)=>{
    res.render("login")
})

router.get("/book",async (req,res)=>{
    const book = await Book.find();
    res.render("book" , {book, key: Publishable_Key});
})

router.get('/user-books', isLoggedIn, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id });
        res.render('editbook', { books });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching books for user' });
    }
});

router.get('/editbook', isLoggedIn, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id });
        res.render('editbook', { user: req.user, books }); 
    } catch (error) {
        res.status(500).send("Error retrieving books.");
    }
});

router.get("/signup",(req,res)=>{
    res.render("signup")
})

router.get("/edit/:id",async (req,res)=>{
    const book = await Book.findById(req.params.id)
    res.render("newedit",{book})
})

module.exports=router;
