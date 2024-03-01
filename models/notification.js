const mongoose=require('mongoose');

const CommentedSchema=new mongoose.Schema({
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        required:true,
    }
})

const NotificationSchema=new mongoose.Schema({
    fromEmail:{
        type:String,
        required:true,
    },
    toEmail:{
        type:String,
        required:true,
    },
    typeOf:{
        type:String,
        required:true,
        enum:['LikedPost','LikedRetweet' ,'LikedComment','Commented', 'Retweeted', 'Messaged', 'Posted']
    },
    read:{
        type:Boolean,
        default:false
    },
    LikedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    LikedRetweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    Posted:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    Retweeted:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    Commented:{
        type : CommentedSchema,
        required: true
    }

},{
    timestamps:true
})

const Notification=mongoose.model('Notification',NotificationSchema);
module.exports=Notification;