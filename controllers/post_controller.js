const Post=require('../models/posts');
const Comment=require('../models/comment');

module.exports.create=async (req,res)=>{
    try {
        let post=await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        return res.status(200).json({msg:"post created successfully"})
    } catch (error) {
        return res.status(404).json({error:error})
  }
}

module.exports.destroy=async (req,res)=>{
    try {
        let post=await Post.findById(req.params.id);
        if(post.user==req.user.id){
            // post.remove();
            await Comment.deleteMany({post:req.params.id});
            await Post.findByIdAndDelete(post.id);

            return res.status(200).json({msg:"sucessfully deleted post"})
        }else{
            return res.status(402).json({msg:"can't delete post"})
        }

    } catch (error) {
        return res.status(404).json({error:error})
    }
}