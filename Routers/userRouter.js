const express = require("express");
const userModel=require("../models/userModel");
const userRouter = express.Router();
const protectRoute=require("./authHelper");
const factory=require("../helpers/factory");
const createUser=factory.createElement(userModel);
const getUsers=factory.getElements(userModel);
const updateUser=factory.updateElements(userModel);
const deleteUser=factory.deleteElements(userModel);
const getUserById=factory.getElementById(userModel);


userRouter.route("/:id")
.get(protectRoute,isAuthorized(["admin","manager"]),getUserById) 
.patch(updateUser)
.delete(protectRoute,isAuthorized(["admin"]),deleteUser);

userRouter
  .route("/")
  .get(protectRoute,isAuthorized(["admin"]),getUsers)
  .post(protectRoute,isAuthorized(["admin"]),createUser)
 

// async function getUsers(req, res) {
//     try{
//       let users=await userModel.find();
//     res.status(200).json({
//       "message":"list of all the users",
//       users:users,
//     })
//     }catch(err){
//       res.status(500).json({
//         error:err.message,
//         "message":"Can't get users"});
//     }
    
//   }
  
  // async function updateUser(req, res) {
  //   try{
  //     let id=req.params.id;
  //     let updatedUser=req.body;
  //     let user=await userModel.findByIdAndUpdate(id,updatedUser,{new:true});
  //     res.status(200).json({
  //       "message":"user Updated",
  //       users:user
  //     })
  //   }catch(err){
  //     res.status(500).json({
  //       error:err.message,
  //       "message":"Can't update user"});
  //   }
    
    
  // }
  
  // async function deleteUser(req, res) {
  //   try{
  //     let id=req.params.id;
  //   let user=await userModel.findByIdAndDelete(id);
  //   if(!user){
  //     res.status(404).json({
  //       message: "user not found"
  //   })
  //   }else{
  //   res.status(200).json({
  //     "message":"user deleted",
  //   })
  // }
  //   }catch(err){
  //     res.status(500).json({
  //       error:err.message,
  //       "message":"Can't delete user"});
  //   }
    
  // }
  
  // async function getUserById(req, res) {
  //   try{
  //     let id=req.params.id;
  //   let user=await userModel.findOne({id});
  //   res.status(200).json({
  //     user:user,
  //   });
  //   }catch(err){
  //       console.log(err);
  //     res.status(500).json({
  //       "message":"Can't get user"});
  //   }
    
  // }

  function isAuthorized(rolesArr){
    return async function(req,res,next){
      let uId=req.uId;
      let {role}=await userModel.findById(uId);
      let isAuth=rolesArr.includes(role);
      
      if(isAuth){
        next();
      }else{
        res.status(404).json({
          "message":"user not authorized contact admin"
        })
      }
    }
  }

  module.exports=userRouter;