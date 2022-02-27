module.exports.createElement=function(Elementmodel){
    return async function(req,res){
        try{
           let elementObj=req.body;
           if(elementObj){
               let element=await Elementmodel.create(elementObj);
               res.status(200).json({
                   element:element
               });
    
           }else{
               res.status(404).json({
                   "message":"Kindly enter data"
               })
           }
        }catch(err){
            console.log(err);
            res.status(500).json({
                
                error:err.message,
                "message":"Can't add"});
            
        }
    }
}

module.exports.getElements=function(Elementmodel){
    return async function(req,res){
        try{
      
            let ans=JSON.parse(req.query.myquery);
            console.log("ans",ans);
            let elementsQuery= Elementmodel.find(ans);
            //sort
            let sortField=req.query.sort;
            let sortQuery=elementsQuery.sort(`-${sortField}`);
            //select->name,price
            let params=req.query.select.split("%").join(" ");
            let filteredQuery=sortQuery.select(`${params} -_id`);
            //pagination
            let page=Number(req.query.page)||1;
            let limit=Number(req.query.limit)||3;
            let toSkip=(page-1)*limit;
            let paginatedResultPromise=filteredQuery.skip(toSkip).limit(limit);
            let result=await paginatedResultPromise;
          res.status(200).json({
            "message":"list of all the elements",
            elements:result,
          })
          }catch(err){
            res.status(500).json({
              error:err.message,
              "message":"Can't get elements"});
          }
    }
}

module.exports.updateElements=function(Elementmodel){
    return async function(req,res){
        try{
            let id=req.params.id;
            let updatedElement=req.body;
            let element=await Elementmodel.findByIdAndUpdate(id,updatedElement,{new:true});
            res.status(200).json({
              "message":"user Updated",
              element:element
            })
          }catch(err){
            res.status(500).json({
              error:err.message,
              "message":"Can't update"});
        }
        
    }
        
}

module.exports.deleteElements=function(Elementmodel){
    return async function(req,res){
        try{
            let id=req.params.id;
          let element=await Elementmodel.findByIdAndDelete(id);
          if(!element){
            res.status(404).json({
              message: "not found"
          })
          }else{
          res.status(200).json({
            "message":"deleted",
          })
        }
          }catch(err){
            res.status(500).json({
              error:err.message,
              "message":"Can't delete"});
          }
    }
}

module.exports.getElementById=function(Elementmodel){
    return async function(req,res){
        try{
            let id=req.params.id;
          let element=await Elementmodel.findOne({id});
          res.status(200).json({
            element,
          });
          }catch(err){
              console.log(err);
            res.status(500).json({
              "message":"Can't get"});
          }
    }
}