const Post=require('../models/post')


module.exports.home=async (req,res)=>{
    try {
    let posts=await Post.find()
    .sort('-createdAt')
    .populate('user')
    .populate('likes')

    return res.status(200).json({posts})
        
    } catch (err) {
        return res.status(401).json({msg:"error in sending post",error:err})        
    }

}