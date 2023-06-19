const Post=require('../models/post')


module.exports.home=async (req,res)=>{
    try {
    let posts=await Post.find()
    .sort('-createdAt')
    .populate('user')
    .populate('likes')
    .populate({
        path:'retweetedRef',
        populate:{
            path:'user'
        }
    })

    // let posts=await Post.find();
    // posts=posts.map(async (post)=>{
    //     if(post.type==='Retweet'){
    //         let y=await post.populate('user').populate('likes')
    //         return 
    //     }else{
    //         let x=await post.populate('user').populate('likes')
    //         return x
    //     }
    // })

    return res.status(200).json({posts})
        
    } catch (err) {
        return res.status(401).json({msg:"error in sending post",error:err})        
    }

}