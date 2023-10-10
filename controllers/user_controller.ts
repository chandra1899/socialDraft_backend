import User from '../models/user'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import fs from 'fs'
// import path from 'path'
import Otp from '../models/OTP'
import nodeMailer from '../mailers/otp'
import signUpMail from '../mailers/signUp'
import formidable from 'formidable'

// const User=require('../models/user')
// const bcrypt=require('bcrypt')
// const jwt=require('jsonwebtoken')
// const fs=require('fs');
// const path=require('path');
// const Otp=require('../models/OTP');
// const nodeMailer=require('../mailers/otp');
// const signUpMail=require('../mailers/signUp');
// const formidable=require('formidable')

export const update=async (req:any,res:any)=>{
    try {
        const form = formidable({});
        form.parse(req, async (err, fields, files) => {
            if(err){
                console.log(err);
                return res.status(500).json(err);
            }
            // console.log(fields, files);
    let user=await User.findById(req.user._id);
     console.log('files===',files);
     user.name=fields.name
     user.description=fields.description
     if(files.avatar){
        user.avatar.data=fs.readFileSync(files.avatar.filepath);
        user.avatar.contentType=files.avatar.mimetype;
        user.photoLocal=false;
     }
     user.save();
     return res.status(200).json({user})
    })
    } catch (err) {
        return res.status(500).json({err})
    }    
}

export const create=async (req:any,res:any)=>{
    try {
        const form = formidable({});
        form.parse(req, async (err, fields, files) => {
            if(err){
                console.log(err);
                return res.status(500).json(err);
            }
            // console.log(fields, files);
        
                    if(fields.password!=fields.confirm_password){
                        return res.status(401).json({error:"password and confirm_password does not match"})
                    }
                    let candidate=await User.findOne({email:fields.email});
                    console.log('files===',files);
                   if(!candidate){
                    let user=await User.create(fields);
                    if(fields.latest!=='avatar_1' && fields.latest!=='avatar_2' && fields.latest!=='avatar_3'){ 
                        user.avatar.data=fs.readFileSync(files?.avatar?.filepath);
                        user.avatar.contentType=files?.avatar?.mimetype;
                        user.photoLocal=false;
                    }else{
                        user.photoLocal_path='default_avatars/'+fields.latest+'.png';
                        user.photoLocal=true;
                    }
                    user.save();
                            signUpMail.signUp(user?.email)
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

export const createSession=(req:any,res:any)=>{
    console.log('sucesfully logged in');
    return res.status(200).json({msg:"sucessfully created session"})
}

export const destroySession=(req:any,res:any,next:any)=>{
    req.logout((err:any)=>{
        if(err){
            return next(err);
        }
        return res.status(200).json({msg:"successfully signed out"})
    });
}
export const getuser=async (req:any,res:any)=>{
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

export const userdetails=async (req:any,res:any)=>{
    try {
        let user=await User.findById(req.params.id).select("-avatar").populate({
            path:'posts',
            select:'-photo',
            populate:{
                path:'user',
                select:'-avatar'
            }}).populate('followers');
            let posts=await user.posts
            return res.status(200).json({user,posts})
    } catch (err) {
        return res.status(500).json({err})
    }
}

export const getReceiver=async (req:any,res:any)=>{
    try {
        let user=await User.findById(req.params.id).select("-avatar");
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

export const sendOTP=async (req:any,res:any)=>{
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

export const verifyOtp=async (req:any,res:any)=>{
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

export const userAvatar=async (req:any,res:any)=>{
    try {
        let user=await User.findById(req.params.id).select('avatar');
        if(user.avatar.data){
            res.set('Content-type',user.avatar.contentType)
            return res.status(200).send(user.avatar.data)
        }
        
    } catch (error) {
        console.log(error);
    }
}