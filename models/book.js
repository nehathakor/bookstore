const mongoose = require("mongoose")

const bookSchema = mongoose.Schema(
    {
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    coverimage:{
        type: String,
    },
    price:{
        type: String,
        required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{timestamps:true});

module.exports=mongoose.model("Book",bookSchema)