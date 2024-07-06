const express = require("express")
const router = express.Router();
const {getBooks, addNewBook, upload, deleteBook, updateBook}=require("../controllers/book");

router.get("/:id",getBooks);
router.post("/",upload.single('coverimage'),addNewBook)


router.delete("/:id",deleteBook)
router.patch("/:id",upload.single('coverimage'),updateBook)

module.exports=router;