const mongoose=require("mongoose");
const {PASSWORD}=process.env;
let DB_LINK = `mongodb+srv://admin:${PASSWORD}@cluster0.oeei8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose
  .connect(DB_LINK)
  .then(function (db) {
    console.log("db connected");
  })
  .catch(function (err) {
    console.log("err", err);
});

const bookingSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"userModel",
        required:true
    },
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:"planModel",
        required:true
    },
    bookedAt:{
        type:Date
    },
    priceAtThatTime:{
        type:Number,
        required:true,
    },
    status:{
        type:String,
        enum:["pending","failed","sucess"],
        required:true,
        default:"pending"
    }
})


const bookingModel=mongoose.model("bookingModel",bookingSchema);

module.exports=bookingModel;