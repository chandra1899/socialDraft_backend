const User=require('../models/user')
const Follow=require('../models/follow');

module.exports.togglefollow=async (req,res)=>{
    try {
        // console.log(req.user);
        let deleted=false;
    let father=await User.findById(req.query.id)
    let son=await User.findById(req.userID)
    // console.log(father,son);
        let existingFollow=await Follow.findOne({
            user:req.userID,
            followable:req.query.id
        })
        // console.log(existingFollow);
        if(existingFollow){
            son.following.pull(existingFollow._id)
            son.save();
            father.followers.pull(existingFollow._id)
            father.save();
            await Follow.findOneAndDelete({
                user:req.userID,
            followable:father._id
            })
            deleted=true
            res.status(200).json({deleted})
           
        }else{
            let newfollow=await Follow.create({
            user:req.userID,
            followable:father._id
            })
            son.following.push(newfollow._id)
            son.save();
            father.followers.push(newfollow._id)
            father.save();
            res.status(200).json({deleted})

        }
        return ;
    } catch (err) {
        return res.status(404).json({error:err})
    }
}

module.exports.yourfollowing=async (req,res)=>{
    try {
        let user=await User.findById(req.userID).populate({
            path:'following',
            populate:{
                path:'followable'
            }})
    // console.log(user);
    let following=await user.following;
    // console.log(following);
    return res.status(200).json({following})
    } catch (err) {
    return res.status(500).json({err})
        
    }
}