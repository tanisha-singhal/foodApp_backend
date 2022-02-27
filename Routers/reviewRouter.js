const express = require("express");
const reviewModel=require("../models/reviewModel");
const planModel=require("../models/planModel");
const reviewRouter = express.Router();
const protectRoute=require("./authHelper");
const factory=require("../helpers/factory");
const createReview= async function(req,res){
  try{
    let review=await reviewModel.create(req.body);
    console.log("review",review);
    let planId=review.plan;
    let plan=await planModel.findById(planId);
    plan.reviews.push(review["_id"]);
    if(plan.averageRating){
      let sum=plan.averageRating* plan.reviews.length;
      let finalAvgRating=(sum+review.rating) / (plan.reviews.length+1);
      plan.averageRating=finalAvgRating;
    }else{
      plan.averageRating=review.rating;
    }
    await plan.save(); 
    res.status(200).json({
      "message":"Review added successfully",
      review,
    })

  }catch(err){
     res.status(500).json({
       message:err.message
     })
  }
}
const getReviews=factory.getElements(reviewModel);
const updateReview=factory.updateElements(reviewModel);
const deleteReview=async function(req,res){
  try{
    let id=req.params.id;
    let review=await reviewModel.findByIdAndDelete(id);
    console.log("review",review);
    let planId=review.plan;
    let plan=await planModel.findById(planId);
    let idxOfReview=plan.reviews.indexOf(review["_id"]);
    plan.reviews.splice(idxOfReview,1);
    await plan.save(); 
    res.status(200).json({
      "message":"Review deleted successfully",
      plan:plan
    })

  }catch(err){
     res.status(500).json({
       message:err.message
     })
  }
}
const getReviewById=factory.getElementById(reviewModel);

reviewRouter.use(protectRoute);

reviewRouter.route("/:id")
.get(getReviewById) 
.patch(updateReview)
.delete(deleteReview);

reviewRouter
  .route("/")
  .get(getReviews)
  .post(createReview)

module.exports=reviewRouter;