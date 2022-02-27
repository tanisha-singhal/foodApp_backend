const express = require("express");
const planModel=require("../models/planModel");
const planRouter = express.Router();
const factory=require("../helpers/factory");
const protectRoute=require("./authHelper");
const createPlan=factory.createElement(planModel);
const updatePlan=factory.updateElements(planModel);
const deletePlan=factory.deleteElements(planModel);
const getPlanById=factory.getElementById(planModel);
const getPlans=factory.getElements(planModel);
const top3plans=async function(req,res){
  try{
  let plans=await planModel.find().sort("-averageRating").limit(3).populate("reviews");
  console.log("plans",plans);
  res.status(200).json({
    plans
  })
  }catch(err){
  console.log(err);
  res.status(500).json({
    "message":err.message
  })
  }
  }
planRouter.use(protectRoute);

planRouter.route("/top3plans").get(top3plans);

planRouter.route("/:id")
.get(getPlanById) 
.patch(updatePlan)
.delete(deletePlan);

planRouter
  .route("/")
  .get(getPlans)
  .post(createPlan);
 


// async function getPlans(req, res) {
//     try{
      
//       let ans=JSON.parse(req.query.myquery);
//       console.log("ans",ans);
//       let plansQuery= planModel.find(ans);
//       //sort
//       let sortField=req.query.sort;
//       let sortQuery=plansQuery.sort(`-${sortField}`);
//       //select->name,price
//       let params=req.query.select.split("%").join(" ");
//       let filteredQuery=sortQuery.select(`${params} -_id`);
//       //pagination
//       let page=Number(req.query.page)||1;
//       let limit=Number(req.query.limit)||3;
//       let toSkip=(page-1)*limit;
//       let paginatedResultPromise=filteredQuery.skip(toSkip).limit(limit);
//       let result=await paginatedResultPromise;
//     res.status(200).json({
//       "message":"list of all the plans",
//       plans:result,
//     })
//     }catch(err){
//       res.status(500).json({
//         error:err.message,
//         "message":"Can't get plans"});
//     }
    
//   }
  
  // async function updatePlan(req, res) {
  //   try{
  //     let id=req.params.id;
  //     let updatedPlan=req.body;
  //     let plan=await planModel.findByIdAndUpdate(id,updatedPlan,{new:true});
  //     res.status(200).json({
  //       "message":"plan Updated",
  //       plan:plan
  //     })
  //   }catch(err){
  //     res.status(500).json({
  //       error:err.message,
  //       "message":"Can't update plan"});
  //   }
    
    
  // }
  
  // async function deletePlan(req, res) {
  //   try{
  //     let id=req.params.id;
  //   let plan=await planModel.findByIdAndDelete(id);
  //   if(!plan){
  //     res.status(404).json({
  //       message: "plan not found"
  //   })
  //   }else{
  //   res.status(200).json({
  //     "message":"plan deleted",
  //   })
  // }
  //   }catch(err){
  //     res.status(500).json({
  //       error:err.message,
  //       "message":"Can't delete plan"});
  //   }
    
  // }
  
  // async function getPlanById(req, res) {
  //   try{
  //     let id=req.params.id;
  //   let plan=await planModel.findById(id);
  //   res.status(200).json({
  //     plan:plan,
  //   });
  //   }catch(err){
  //       console.log(err);
  //     res.status(500).json({
  //       "message":"Can't get plan"});
  //   }
    
  // }

  

  module.exports=planRouter;