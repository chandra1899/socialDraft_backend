const User=require('../models/user')

module.exports.create=async (req,res)=>{
    if(req.body.password!=req.body.confirm_password){
        return res.status(400).json({error:"password and confirm_password does not match"})
    }
    try {
        let user=await User.findOne({email:req.body.email});
        if(!user){
            await User.create(req.body);
            return res.status(200).json({msg:"successfully created user"})
        }
        else{
            res.status(400).json({error:"user already exites"})
        }
    } catch (err) {
        console.log("error in creating user in database",err);
        return res.status(404).json({error:err}) ;
    }
}

module.exports.signIn=(req,res)=>{
    if(!req.isAuthenticated()){
        return res.status(401).json({msg:"unable to Authenticated"})
    }
}

module.exports.createSession=(req,res)=>{
    return res.status(200).json({msg:"sucessfully created session"})
}

module.exports.destroySession=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        return res.status(200).json({msg:"successfully signed out"})
    });
}