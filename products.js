const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id:Number,
  name:String,
  description:String,
  amount:Number
})


module.exports=mongoose.model("Product",productSchema)

