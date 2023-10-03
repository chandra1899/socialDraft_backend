// const mongoose=require('mongoose');
import mongoose from 'mongoose'

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    otp:{
        type:String,
        required:true,
    },
    setOn:{
        type:Number,
        required:true,
    }
},{
    timestamps:true
})

const Otp=mongoose.model('Otp',otpSchema);
export default Otp;