const User=require('../models/user')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const fs=require('fs');
const path=require('path');
const Otp=require('../models/OTP');
const nodeMailer=require('../mailers/otp');
const signUpMail=require('../mailers/signUp');


module.exports.update=async (req,res)=>{
    try {
    let user=await User.findById(req.user._id);
    User.uploadedAvatar(req,res,(err)=>{
     if(err){
         console.log('***** multer error',err);
         console.log(req.file);
         console.log("error",err);
        return res.status(500).json({err})
         
     }
     console.log('files===',req.files);
     user.name=req.body.name
     user.description=req.body.description
     if(req.files.avatar){
        console.log(user.avatar);
        if(!user.photoLocal)
        fs.unlinkSync(path.join(__dirname,'..','..',user.avatar));
        user.avatar=User.avatarPath+'/'+req.files.avatar[0].filename
        user.photoLocal=false;
     }
     user.save();
     return res.status(200).json({user})
    })
    } catch (err) {
        return res.status(500).json({err})
    }    
}

module.exports.create=async (req,res)=>{
    try {
            
                User.uploadedAvatar(req,res,async(err)=>{
                    if(err){
                        console.log('***** multer error',err);
                        console.log(req.file);
                        console.log("error",err);
                       return res.status(500).json({err})      
                    }
                    if(req.body.password!=req.body.confirm_password){
                        return res.status(401).json({error:"password and confirm_password does not match"})
                    }
                    let candidate=await User.findOne({email:req.body.email});
                    console.log('files===',req.files);
                   if(!candidate){
                    let user=await User.create(req.body);
                    if(req.body.latest!=='avatar_1' && req.body.latest!=='avatar_2' && req.body.latest!=='avatar_3'){ 
                        user.avatar=User.avatarPath+'/'+req.files.avatar[0].filename;
                        user.photoLocal=false;
                    }else{
                        user.avatar=User.avatarPath_a+'/'+req.body.latest+'.png';
                        user.photoLocal=true;
                    }
                    user.save();
                            signUpMail.signUp(user.email)
                            return res.status(200).json({msg:"successfully created user"})
                   }else{
                        res.status(400).json({error:"user already exites"})
                    }
                   }) 
    } catch (err) {
        console.log("error in creating user in database",err);
        return res.status(500).json({error:err}) ;
    }
}

module.exports.createSession=(req,res)=>{
    console.log('sucesfully logged in');
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
module.exports.getuser=async (req,res)=>{
    try {
        if(req.user){
            let can=req.user;
            return await res.status(200).json({can})
        }
        else {
            return res.status(404).json({msg:"no user"})
        }
    } catch (err) {
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

module.exports.getReceiver=async (req,res)=>{
    try {
        let user=await User.findById(req.params.id);
            return res.status(200).json({user})
    } catch (err) {
        return res.status(500).json({err})
    }
}

const generateOtp=()=>{
    let otp='';
    for(let i=0;i<4;i++){
        otp+=Math.floor(Math.random()*10);
    }
    return otp
}

module.exports.sendOTP=async (req,res)=>{
    try {
        let email=req.body.email;
        let otp=generateOtp();
       let OTP=await Otp.findOne({email:email});
       if(OTP){
        if(Date.now()-OTP.setOn>600000){
            OTP.setOn=Date.now();
            OTP.otp=otp;
            await OTP.save();
            nodeMailer.sendOtp(email,otp);
        }else{
            nodeMailer.sendOtp(email,OTP.otp);
        }
       }else{
        let newOtp=await Otp.create({
            email:email,
            otp:otp,
            setOn:Date.now()
        })
        nodeMailer.sendOtp(newOtp.email,newOtp.otp);

       }
       return res.status(200).json({email});
        
    } catch (error) {
        console.log(error);
       return res.status(500).json({error});
        
    }
}

module.exports.verifyOtp=async (req,res)=>{
    try {
        console.log(req.body);
        if(req.body.password!==req.body.confirm_password){
            return res.status(400).json({msg:'password doesnot match'});
        }
        let email=req.body.email;
        console.log("email====",req.body);
        let OTP=await Otp.findOne({email:email});
        if(OTP.otp!==req.body.otp){
            return res.status(401).json({msg:'otp is not valid'});
        }
        let user=await User.findOne({email:email});
        user.password=req.body.password;
        await user.save();
        return res.status(200).json({msg:'sucessfully changed password'});
    } catch (error) {
        console.log(error);
       return res.status(500).json({error});
    }
}