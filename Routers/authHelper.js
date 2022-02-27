const jwt=require("jsonwebtoken");
const {JWT_KEY}=process.env;
function protectRoute(req,res,next){
    try{
       if(req.cookies.jwt){
           let isVerified=jwt.verify(req.cookies.jwt,JWT_KEY);
           if(isVerified){
               req.uId=isVerified.id;
            next();
           }
           }else{
           res.status(401).json({
               "message":"You are not allowed"
           })
       }
    }catch(err){
        res.status(500).json({
            'message':'Server error'
        })
    }
}
module.exports=protectRoute;