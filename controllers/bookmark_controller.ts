import User from '../models/user'
import Bookmark from '../models/bookmark'
// import { Request, Response } from 'express';

// const User=require('../models/user');
// const Bookmark=require('../models/bookmark')

const toggleBookmark=async (req:any,res:any)=>{
    let user=await User.findById( req.user._id);
    let deleted=false;

    let existing=await Bookmark.findOne({
        user: req.user._id,
        bookmark:req.query.id
    })
    if(existing){
        await Bookmark.findOneAndDelete({
        user:req.user._id,
        bookmark:req.query.id
        })
        user.bookmark.pull(existing._id)
        user.save()
        deleted=true;
        res.status(200).json({deleted})
    }else{
        let newBookmark=await Bookmark.create({
        user: req.user._id,
        bookmark:req.query.id
        })
        user.bookmark.push(newBookmark._id)
        user.save();
        res.status(200).json({deleted})
    }
    return ;
}
export default toggleBookmark