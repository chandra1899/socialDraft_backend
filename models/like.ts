// const mongoose=require('mongoose');
import mongoose from 'mongoose'

const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    likable:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:'onModel'
    },
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},{
    timestamps:true
})

const Like=mongoose.model('Like',likeSchema);
export default Like;