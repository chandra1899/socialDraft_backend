const User=require('../models/user');
const Bookmark=require('../models/bookmark')

module.exports.toggleBookmark=async (req,res)=>{
    let user=await User.findById( req.userID);
    let deleted=false;

    let existing=await Bookmark.findOne({
        user: req.userID,
        bookmark:req.query.id
    })
    if(existing){
        await Bookmark.findOneAndDelete({
        user: req.userID,
        bookmark:req.query.id
        })
        user.bookmark.pull(existing._id)
        user.save()
        deleted=true;
        res.status(200).json({deleted})
    }else{
        let newBookmark=await Bookmark.create({
        user: req.userID,
        bookmark:req.query.id
        })
        user.bookmark.push(newBookmark._id)
        user.save();
        res.status(200).json({deleted})
    }
    return ;
}