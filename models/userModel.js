const mongoose = require("mongoose");
const {PASSWORD}=process.env;
let DB_LINK = `mongodb+srv://admin:${PASSWORD}@cluster0.oeei8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const emailValidator=require("email-validator");
mongoose
  .connect(DB_LINK)
  .then(function (db) {
    console.log("db connected");
  })
  .catch(function (err) {
    console.log("err", err);
  });
// syntax
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  age:{
      type:Number,
  },
  password:{
      type:String,
      minLength:7,
      required:true,
  },
  confirmPassword:{
      type:String,
      minLength:7,
      validate:function(){
            return this.password=this.confirmPassword
      },
      required:true
  },
  CreatedAt:Date,
  token:String,
  role:{
    type:String,
    enum:["admin","user","manager"],
    default:"user"
  },
  bookings:{
    type:[mongoose.Schema.ObjectId],
    ref:"bookingModel"

  }
});
// order matters
userSchema.pre("save",function(){
    console.log("Hello");
    this.confirmPassword=undefined;
});
userSchema.methods.resetHandler=function (password,confirmPassword){
this.password=password;
this.confirmPassword=confirmPassword;
this.token=undefined;
}
const userModel=mongoose.model("userModel",userSchema);
// (async function createUser(){
//     let user=await userModal.create({
//         name:"Tanisha",
//         password:"12345678",
//         age:19,
//         email:"tanu@gmail.com",
//         confirmPassword:"12345678"
//     });
//     console.log("user",user)
// })();

module.exports=userModel;
