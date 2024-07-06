const mongoose = require("mongoose");

const connectDb = async(req,res)=>{
    await mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>console.log("Connected"))
    .catch(()=>process.exit(1));
}

module.exports=connectDb;