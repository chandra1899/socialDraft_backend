const Like=require('../models/like')
const Bookmark=require('../models/bookmark')
const Post=require('../models/post')
const Comment=require('../models/comment')


module.exports.isliked=async (req,res)=>{
    try {
        let likeexist=false;
        let like=await Like.findOne({
            likable:req.query.id,
            onModel:req.query.type,
            user:req.userID
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
            user:req.userID
        })
        if(bookmark) {
            bookmarkexist=true
        }
        return res.status(200).json({bookmarkexist})

    } catch (err) {
        return res.status(404).jason({error:err})
    }
}