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

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,"Review can't be empty"]
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,"Review must contain some rating"]
    },
    createdAt:{
         type:Date,
         default:Date.now
    },
    // to take reference of another model we use the metod below. 
    //it stores the id of the model object and when we use populate it populates the object present at that id location.
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"userModel",
        required:[true,"Review must belong to a user"],
    },
    plan:{
        type:mongoose.Schema.ObjectId,
        ref:"planModel",
        required:[true,"Review must belong to a plan"],
    }

})


const reviewModel=mongoose.model("reviewModel",reviewSchema);

module.exports=reviewModel;