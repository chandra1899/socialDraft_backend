const Comment=require('../models/comment')
const Post=require('../models/post')
const Like=require('../models/like')

module.exports.create=async (req,res)=>{
    try {
     let post=await Post.findById(req.body.post);
     let comment;
     if(post){
         comment=await Comment.create({
             content:req.body.content,
             post:req.body.post,
             user:req.user._id
         });
         comment=await comment.populate('user');
         post.comments.push(comment);
         post.save();
         res.status(200).json({comment})
     }
    } catch (err) {
     console.log("error in creating the comment",err);
     return res.status(404).json({error:err}) ;
    }
 }

 module.exports.destroy=async (req,res)=>{
    try {
        let comment=await Comment.findById(req.params.id);
        if(comment.user==req.user.id){
        let postId=comment.post;
        await Comment.findByIdAndDelete(comment.id);
        await Like.deleteMany({likable:comment._id,onModel:'Comment'});
        await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
        return res.status(200).json({msg:"sucessfully deleted comment"})
    }else{
        return res.status(402).json({msg:"can't delete comment"})
    }
    } catch (err) {
        console.log("error in deleting the comment",err);
        return res.status(500).json({error:err})
    }
}