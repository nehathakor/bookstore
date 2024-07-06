const Book = require("../models/book")
const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.resolve("./public/uploads"))
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.originalname
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })
  

// const getBooks = async (req,res)=>{
//   const books = await Book.find({}).populate('user');
//   res.render('book', { books, currentUser: req.user });
// };

const getBooks = async (req,res)=>{
  const book = await Book.findById(req.params.id);
  res.render('bookDetails', { book});
};

const addNewBook = async(req,res)=>{
    console.log(req.file);
    const {title,price,description,coverimage,author} = req.body
    if(!title || !price || !author){
        return res.status(400).json({message:"All fields are required"})
    }
    const book = await Book.find({title})
    if(book.length != 0){
        return res.render("addbook",{error:"Book already exist"});
    }

    const newBook = await Book.create({
        title,
        price,
        description,
        author,
        coverimage:`/uploads/${req.file.filename}` , 
        user: req.user._id,
    });
    console.log("Book created:", newBook);
    res.redirect("/book")
}

const deleteBook = async(req,res)=>{
  await Book.deleteOne({_id:req.params.id})
  res.redirect("/book")
}

const updateBook = async(req,res)=>{
  const book = await Book.findByIdAndUpdate(req.params.id,{...req.body,coverimage:`/uploads/${req.file.filename}`},
    {new:true}
  )
  res.redirect("book")
}
module.exports={getBooks, addNewBook, upload, deleteBook, updateBook };