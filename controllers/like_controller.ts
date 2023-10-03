const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.toggleLike=async (req,res)=>{
    try {
        let likable;
        let deleted=false;
        if(req.query.type=='Post'){
            likable=await Post.findById(req.query.id);
        }else{
            likable=await Comment.findById(req.query.id);
        }
        let existingLike=await Like.findOne({
            likable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        });
        if(existingLike){
            likable.likes.pull(existingLike._id);
            likable.save();
           await  Like.findOneAndRemove({
                likable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
            })
            deleted=true;
        }else{
            let newLike=await Like.create({
                user:req.user._id,
                likable:req.query.id,
                onModel:req.query.type
            });
            likable.likes.push(newLike._id);
            likable.save();
        }
        return res.status(200).json({deleted:deleted})
    } catch (err) {
        return res.status(404).json({error:`error in making a like :-${err}`}) ;
    }
}