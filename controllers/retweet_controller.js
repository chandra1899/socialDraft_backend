const User=require('../models/user');
const Retweet=require('../models/retweet');
const Post=require('../models/post');

module.exports.toggleRetweet=async (req,res)=>{
    let user=await User.findById( req.user._id);
    let deleted=false;
    let retweetedpost=await Post.findById(req.query.id);

    let existing=await Retweet.findOne({
        user: req.user._id,
        retweet:req.query.id
    })
    if(existing){
        await Retweet.findOneAndDelete({
        user:req.user._id,
        retweet:req.query.id
        });
        await Post.findOneAndDelete({
            type:'Retweet',
            user:req.user._id,
            retweetedRef:req.query.id
        })
        user.retweets.pull(existing._id)
        user.save()
        retweetedpost.retweets.pull(existing._id);
        retweetedpost.save();
        deleted=true;
        res.status(200).json({deleted})
    }else{
        let newRetweet=await Retweet.create({
        user: req.user._id,
        retweet:req.query.id
        })
        await Post.create({
            type:'Retweet',
            user:req.user._id,
            retweetedRef:req.query.id
        })
        user.retweets.push(newRetweet._id)
        user.save();
        retweetedpost.retweets.push(newRetweet._id)
        retweetedpost.save();
        res.status(200).json({deleted})
    }
    return ;
}