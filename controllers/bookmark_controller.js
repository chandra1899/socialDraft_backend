const User=require('../models/user');
const Bookmark=require('../models/bookmark')

module.exports.toggleBookmark=async (req,res)=>{
    let user=await User.findById(req.user._id);

    let existing=await Bookmark.findOne({
        user:req.user._id,
        bookmark:req.query.id
    })
    if(existing){
        await Bookmark.findOneAndDelete({
        user:req.user._id,
        bookmark:req.query.id
        })
        user.bookmark.pull(existing._id)
        user.save()
        res.status(200).json({msg:"successfully destroyed bookmark"})
    }else{
        let newBookmark=await Bookmark.create({
        user:req.user._id,
        bookmark:req.query.id
        })
        user.bookmark.push(newBookmark._id)
        user.save();
        res.status(200).json({msg:"successfully created bookmark"})
    }
    return ;
}