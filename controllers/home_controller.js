const Post=require('../models/post')

module.exports.home=async (req,res)=>{
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