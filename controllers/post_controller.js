const Post=require('../models/post');
const Comment=require('../models/comment');
const User=require('../models/user')
const Bookmark=require('../models/bookmark')
const Like=require('../models/like')
const Retweet=require('../models/retweet')
const fs=require('fs');
const path=require('path');
// const postMailer=require('../mailers/otp');

module.exports.create=async (req,res)=>{
    try {
        let user=await User.findById(req.user._id)
        User.uploadedAvatar(req,res,async (err)=>{
            if(err){
                console.log('***** multer error',err);
                console.log(req.file);
                console.log("error",err);
               return res.status(500).json({err})
                
            }
            console.log('files===',req.files);
            let post=await Post.create({
                content:req.body.content,
                user:req.user._id
            });
            user.posts.push(post)
            // user.name=req.body.name
            // user.description=req.body.description
            if(req.files.postPhoto){
                // if(user.avatar){
                //     fs.unlinkSync(path.join(__dirname,'..','..',user.avatar));
                // }
                post.photo=User.userPostPath+'/'+req.files.postPhoto[0].filename
            }
            user.save();
            post=await post.populate('user')
            post.save();
            // postMailer.newPost(post)
        return res.status(200).json({post})

            // user.save();
            // return res.status(200).json({user})
           })
        // let post=await Post.create({
        //     content:req.body.content,
        //     user:req.user._id
        // });
        // let user=await User.findById(req.user._id);
        // user.posts.push(post._id);
        // user.save();
    } catch (error) {
        return res.status(500).json({error:error})
  }
}

module.exports.destroy=async (req,res)=>{
    try {
        let post=await Post.findById(req.params.id).populate('user').populate('comments');
        let comments=await post.comments
        if(post.user.id==req.user._id){
            console.log('in delete');
            await Like.deleteMany({likable:post._id,onModel:'Post'});
            for(comment of comments){
                await Like.deleteMany({_id:{$in:comment.likes}});
            }
            await Comment.deleteMany({post:req.params.id});
            await User.findByIdAndUpdate(post.user._id,{$pull:{posts:req.params.id}});
            await Bookmark.deleteMany({bookmark:req.params.id});
            if(post.photo){
                fs.unlinkSync(path.join(__dirname,'..','..',post.photo));
            }

            // await Retweet.deleteMany({
            //     retweet:req.params.id
            //     });

                let retweetedPosts=await Post.find({
                    type:'Retweet',
                    retweetedRef:req.params.id
                })

                for(retweetedPost of retweetedPosts){
                    let retweet=await Post.findById(retweetedPost._id).populate('user').populate('comments')
                    let retweetcomments=await retweet.comments
                        console.log('in delete retweets');
                        await Like.deleteMany({likable:retweet._id,onModel:'Post'});
                        for(retweetcomment of retweetcomments){
                            await Like.deleteMany({_id:{$in:retweetcomment.likes}});
                        }
                        await Comment.deleteMany({post:retweet._id});
                        await Bookmark.deleteMany({bookmark:retweet._id});
                        let retweetedUser=await User.findById(retweet.user._id);
                        let existingretweet=await Retweet.findOne({
                            user: retweetedUser._id,
                            retweet:req.params.id
                        })
                        retweetedUser.retweets.pull(existingretweet._id)
                        retweetedUser.save();
                        await Retweet.findByIdAndDelete(existingretweet._id);
                        await Post.findByIdAndDelete(retweet._id);
                }

                await Post.findByIdAndDelete(post._id);
            return res.status(200).json({msg:"sucessfully deleted post"});
        }else{
            return res.status(402).json({msg:"can't delete post"})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error})
    }
}

module.exports.yourposts=async (req,res)=>{
    try {
    let user=await req.user.populate('posts');
    let yourposts=await user.posts.reverse();
    console.log(yourposts);
    return res.status(200).json({yourposts});
    } catch (err) {
    return res.status(500).json({err});   
    }
}

module.exports.yourretweets=async (req,res)=>{
    try {
    let user=await req.user.populate({
        path:'retweets',
        populate:{
            path:'retweet',
            populate:{
                path:'user'
            }
        }
    });
    let yourretweets=await user.retweets.reverse();
    console.log(yourretweets);
    return res.status(200).json({yourretweets});
    } catch (err) {
    return res.status(500).json({err});   
    }
}

module.exports.getpost=async (req,res)=>{
    try {
        let post=await Post.findById(req.params.id)
        .populate('user')
        .populate({
        path:'comments',
        populate:{
            path:'user'
        }})
        .populate({
            path:'retweetedRef',
            populate:{
                path:'user'
            }
        })
    return res.status(200).json({post})

    } catch (err) {
    return res.status(404).json({err})
        
    }
}

module.exports.savedposts=async (req,res)=>{
    try {
    let savedposts=await Bookmark.find({user:req.user._id})
    .sort('-createdAt')
    .populate({
        path:'bookmark',
        populate:[{
            path:'user'
        },
        {path:'retweetedRef',
        populate:{
            path:'user'
        }}
    ]         
    })
    return res.status(200).json({savedposts})

    } catch (err) {
    return res.status(404).json({err})
    }
}