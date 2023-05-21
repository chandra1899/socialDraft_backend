const Post=require('../models/post');
const Comment=require('../models/comment');
const User=require('../models/user')

module.exports.create=async (req,res)=>{
    try {
        let post=await Post.create({
            content:req.body.content,
            user:req.userID
        });
        let user=await User.findById(req.userID);
        user.posts.push(post._id);
        user.save();
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
            let user=await User.findById(req.user._id);
            user.posts.pull(post._id);
            user.save();

            return res.status(200).json({msg:"sucessfully deleted post"})
        }else{
            return res.status(402).json({msg:"can't delete post"})
        }

    } catch (error) {
        return res.status(404).json({error:error})
    }
}

module.exports.yourposts=async (req,res)=>{
    try {
        let user=await req.rootUser.populate('posts');
    let yourposts=await user.posts.reverse();
    // console.log(yourposts);
    return res.status(200).json({yourposts});
    } catch (err) {
    return res.status(404).json({err});   
    }
}