const jwt=require("jsonwebtoken")
const User=require('../models/user')

const Authenticate=async (req,res,next)=>{
    try {
        const token=req.cookies.jwttoken;
      if(token){
        const verifyToken=await jwt.verify(token,'something')
        const rootUser=await User.findOne({_id:verifyToken._id,"tokens.token":token})
        if(!rootUser){
            return res.status(404).json({msg:"user not found"})
        }
        else{
            req.token=token;
            req.rootUser=rootUser;
            req.userID=rootUser._id;
            next();
        }
      }else{
        return res.status(404).json({msg:"user not found"})
      }
    } catch (err) {
        return res.status(401).json({error:"unautherized:no token provided"})
    }
}

module.exports=Authenticate