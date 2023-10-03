// const mongoose=require('mongoose');
import mongoose from 'mongoose'

const followSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    followable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

const Follow=mongoose.model('Follow',followSchema);
export default Follow;