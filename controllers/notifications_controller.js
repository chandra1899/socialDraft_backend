const User=require('../models/user');
const Notification=require('../models/notification');

module.exports.getnotifications=async (req,res)=>{
    try {
        let user=await User.findById( req.user._id);
        let notifications = await Notification.find({
            toEmail : user.email
        }).sort('-createdAt')
        .populate({
            path:'Posted',
            select:"-photo"
        }).populate({
            path:'Retweeted',
            select:"-photo",
            populate:{
                path:'retweetedRef',
                select:"-photo",
            }
        }).populate({
            path:'LikedPost',
            select:"-photo"
        }).populate({
            path:'LikedRetweet',
            select:"-photo",
            populate:{
                path:'retweetedRef',
                select:"-photo",
            }
        }).populate({
            path:'Commented',
            populate:{
                path:'commentId'
            }
        })

        // console.log(notifications);
        res.status(200).json({notifications})
    } catch (err) {
        console.log("error in getting notifications",err);
        return res.status(500).json({error:err})
    }
}