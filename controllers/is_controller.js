const Like=require('../models/like')
const Bookmark=require('../models/bookmark')
const Post=require('../models/post')
const Comment=require('../models/comment')
const Follow=require('../models/follow')
const User=require('../models/user')


module.exports.isliked=async (req,res)=>{
    try {
        let likeexist=false;
        let like=await Like.findOne({
            likable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        })
        if(like) {
            likeexist=true
        }
        let likes
       if(req.query.type=='Post')
       {
        let post=await Post.findById(req.query.id)
        likes=post.likes.length
       }else{
        let comment=await Comment.findById(req.query.id)
        likes=comment.likes.length
       }
        // console.log(likes);
        // console.log(user);
        return res.status(200).json({likeexist,likes})

    } catch (err) {
        return res.status(404).json({error:err})
    }
}

module.exports.issaved=async (req,res)=>{
    try {
        let bookmarkexist=false;
        let bookmark=await Bookmark.findOne({
            bookmark:req.query.id,
            user:req.user._id
        })
        if(bookmark) {
            bookmarkexist=true
        }
        return res.status(200).json({bookmarkexist})

    } catch (err) {
        return res.status(404).jason({error:err})
    }
}

module.exports.isfollow=async (req,res)=>{
    try {
        let followexist=false;
        console.log(req.query.id);
        let follow=await Follow.findOne({
            user:req.user._id,
            followable:req.query.id
        })
        if(follow) {
            followexist=true
        }
        let user=await User.findById(req.query.id)
        let followers=user.followers.length

        return res.status(200).json({followexist,followers})
        
    } catch (err) {
        return res.status(404).json({error:err})
        
    }
}