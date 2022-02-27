const mongoose=require("mongoose");
const {PASSWORD}=process.env;
let DB_LINK = `mongodb+srv://admin:${PASSWORD}@cluster0.oeei8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose
  .connect(DB_LINK)
  .then(function () {
    console.log("db connected");
  })
  .catch(function (err) {
    console.log("err", err);
  });

const planSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Kindly enter the name"],
        unique:true,
        maxlength:[40,"Your plan length is more than 40 characters"]
    },
    duration:{
        type:Number,
        required:[true,"You need to provide duration"]
    },
    price:{
        type:Number,
        required:true,
    },
    ratingAverage:{
        type:Number,
        
    },
    discount:{
        type:Number,
        validate:{
            validator:function(){
                return this.discount<this.price;

            },
            message:"discount must be less than actual price",
        }
    },
    reviews:{
        type:[mongoose.Schema.ObjectId],
        ref:"reviewModel"
    },
    averageRating:{
        type:Number
    }

});

const planModel=mongoose.model("planModel",planSchema);
module.exports=planModel;