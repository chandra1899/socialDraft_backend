const User=require('../models/user')
const Follow=require('../models/follow');

module.exports.togglefollow=async (req,res)=>{
    try {
        // console.log(req.user);
    let father=await User.findById(req.query.id)
    let son=await User.findById(req.user._id)
    // console.log(father,son);
        let existingFollow=await Follow.findOne({
            user:req.user._id,
            followable:req.query.id
        })
        // console.log(existingFollow);
        if(existingFollow){
            son.following.pull(existingFollow._id)
            son.save();
            father.followers.pull(existingFollow._id)
            father.save();
            await Follow.findOneAndDelete({
                user:req.user._id,
            followable:father._id
            })
            res.status(200).json({msg:"successfully unfollow"})
           
        }else{
            let newfollow=await Follow.create({
            user:req.user._id,
            followable:father._id
            })
            son.following.push(newfollow._id)
            son.save();
            father.followers.push(newfollow._id)
            father.save();
            res.status(200).json({msg:"successfully follow"})

        }
        return ;
    } catch (err) {
        return res.status(404).json({error:err})
    }
}