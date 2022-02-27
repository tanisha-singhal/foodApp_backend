const express = require("express");
const jwt=require("jsonwebtoken");
const emailSender = require("../helpers/emailSender");
const userModel=require("../models/userModel");
const {JWT_KEY}=process.env;
const authRouter=express.Router();
authRouter
.post("/signup",setCreatedAt,signUpUser)
.post("/login",loginUser)
.post("/forgetPassword",forgetPassword)
.post("/resetPassword",resetPassword);

function setCreatedAt(req,res,next){
    let body=req.body;
    let length=Object.keys(body).length;
    if(length==0){
      res.status(400).json({"message":"Can't add empty user to database."})
    }
    req.body.CreatedAt=new Date().toISOString();
    next();
}

async function signUpUser(req,res){
    try{
      let userObj =req.body;
      let user=await userModel.create(userObj);
      console.log("user",user);
      // user.push({
      //     email,name,password
      // })
      res.status(200).json({
          message:"user created",
          createdUser:userObj,
      })
    }catch(err){
      res.status(500).json({"message":err.message});
    }
      
}

async function loginUser(req,res){
      try{
           if(req.body.email){
               let user=await userModel.findOne({"email":req.body.email});
               if(user){
                if(user.password==req.body.password){
                    let payload=user["_id"];
                    let token=jwt.sign({id:payload},JWT_KEY);
                    res.cookie("jwt",token,{httpOnly:true});
                    return res.status(200).json({
                        "message":"user logged in",
                        user
                    })
                }else{
                    return res.status(401).json({
                        "message":"Email or Password is wrong"
                    })
                }
               }else{
                return res.status(401).json({
                    "message":"Email or Password is wrong"
                })
               }
               
           }else{
               return res.status(403).json({
                   "message":"Email is not present"
               })
           }
      }catch(err){
          console.log(err);
            res.status(500).json({
                "message":"Email is not present"
            })
      }
}

async function forgetPassword(req,res){
    let email=req.body.email;
    let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    //console.log(seq);
    try{
        if(email){
            await userModel.updateOne({email},{token:seq});
            // email send to
            let user=await userModel.findOne({email});
            await emailSender(seq,user.email);
            console.log(user);
            if(user?.token){
                return res.status(200).json({
                    message:"Email send with token"+seq
                })
            }else{
                return res.status(404).json({
                    message:"user not found"
                })
            }
        }else{
            return res.status(400).json({
                message:"Kindly enter email"
            })
        }

    }catch(err){
        //console.log(err);
        res.status(500).json({
            message:err.message
        })

    }
}

async function resetPassword(req,res){
    let {token,password,confirmPassword}=req.body;
    try{
        if(token){
            let user=await userModel.findOne({token});
            if(user){
                user.resetHandler(password,confirmPassword);
                await user.save();
                return res.status(200).json({
                    "message":"password reset"
                })
            }else{
                return res.status(404).json({
                    message:"Incorrect token"
                })
            }
        }else{
            return res.status(404).json({
                message:"user not found"
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:err.message
        })
    }
    
   
}
  module.exports=authRouter;