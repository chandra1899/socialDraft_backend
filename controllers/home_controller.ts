import Post from '../models/post'

// const Post=require('../models/post')

const home=async (req:any,res:any)=>{
    try {
    let posts=await Post.find({}).select("-photo")
    .sort('-createdAt')
    .populate({
        path:'user',
        select:'-avatar'
    })
    .populate('likes')
    .populate({
        path:'retweetedRef',
        select:'-photo',
        populate:{
            path:'user',
            select:'-avatar'
        }
    })

    return res.status(200).json({posts})
        
    } catch (err) {
        return res.status(401).json({msg:"error in sending post",error:err})        
    }

}
export default home