const jwt=require("jsonwebtoken")
const User=require('../models/user')

const Authenticate=async (req,res,next)=>{
    try {
        const token=req.cookies.jwttoken;
        // console.log("my cookie is :",token);
        const verifyToken=await jwt.verify(token,'something')
        // console.log("my verify is :",verifyToken);
        const rootUser=await User.findOne({_id:verifyToken._id,"tokens.token":token})
        // console.log("d");
        if(!rootUser){
            return res.status(404).json({msg:"user not found"})
        }
        else{
            req.token=token;
            req.rootUser=rootUser;
            req.userID=rootUser._id;
            next();
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({error:"unautherized:no token provided"})
    }
}

module.exports=Authenticate