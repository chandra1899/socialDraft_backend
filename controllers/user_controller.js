const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const fs=require('fs');
const path=require('path');


module.exports.update=async (req,res)=>{
    try {
        // console.log(req.body);
    // let user=await User.findById(req.user._id)
        // user.name=req.body.name
        // user.description=req.body.description
    //     await user.save()
    //     // console.log(user);
    //     return res.status(200).json({user})
    // console.log(req.file);

    let user=await User.findById(req.user._id);
    User.uploadedAvatar(req,res,(err)=>{
     if(err){
         console.log('***** multer error',err);
         console.log(req.file);
         console.log("error",err);
        return res.status(500).json({err})
         
     }
    //  console.log(req.file);
     user.name=req.body.name
     user.description=req.body.description
     if(req.file){
        //  if(user.avatar){
        //      fs.unlinkSync(path.join(__dirname,'..','..',user.avatar));
        //  }
         user.avatar=User.avatarPath+'/'+req.file.filename
     }
     user.save();
     return res.status(200).json({user})
    })
    } catch (err) {
        return res.status(500).json({err})
    }    
}

module.exports.create=async (req,res)=>{
    // console.log(req.body);
    if(req.body.password!=req.body.confirm_password){
        return res.status(401).json({error:"password and confirm_password does not match"})
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
        return res.status(500).json({error:err}) ;
    }
}

module.exports.signIn=async (req,res)=>{
    // if(!req.isAuthenticated()){
    //     return res.status(401).json({msg:"unable to Authenticated"})
    // }
    try {
        // console.log(req.body);
        // console.log('under signIn');
        const {email,password}=req.body;
    if(!email || !password){
        return res.status(404).json({msg:"please fill the data"});
    }

    let userlogin=await User.findOne({email:email});
    // console.log(userlogin);
    if(userlogin){
        let match=await bcrypt.compare(password,userlogin.password);
        // console.log(match);
        if(match){
            const tok=await userlogin.generateAuthToken();
            console.log(tok);
            await res.cookie("jwttoken",tok);
            console.log(req.cookies);
            console.log(tok);

            return res.status(200).json({msg:"successfully signIn"})
        }else{
            return res.status(404).json({msg:"invalid username/password"})
        }
    }else{
        return res.status(404).json({msg:"please signUp"})
    }
    
    } catch (err) {
        return res.status(400).json({msg:"error in signIn",error:err})
    }
}

module.exports.createSession=(req,res)=>{
    // console.log(req.user);
    console.log('sucesfully logged in');
    // if(myerr){
    //     console.log(myerr);
    // return res.status(500).json({msg:"sucessfully created session"})

    // }
    return res.status(200).json({msg:"sucessfully created session"})

    // return res.redirect('/');
}

module.exports.destroySession=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        // console.log(req.user);
        return res.status(200).json({msg:"successfully signed out"})
    });
}
module.exports.getuser=async (req,res)=>{
    // console.log(req.rootUser);
    try {
        // let can=await req.rootUser;
        if(req.user){
            // console.log(can);
            let can=req.user;
            return await res.status(200).json({can})
        }
        else {
            return res.status(404).json({msg:"no user"})
        }
    } catch (err) {
        // console.log(err);
        return res.status(404).json({msg:"error in getting user",error:err})
    }  
}

module.exports.userdetails=async (req,res)=>{
    try {
        let user=await User.findById(req.params.id).populate({
            path:'posts',
            populate:{
                path:'user'
            }}).populate('followers');
            let posts=await user.posts
            return res.status(200).json({user,posts})
    } catch (err) {
        return res.status(500).json({err})
    }
}