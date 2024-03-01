const mongoose=require('mongoose');

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
        enum:['LikedPost' ,'LikedComment','Commented', 'Retweeted', 'Messaged', 'Posted']
    },
    read:{
        type:Boolean,
        default:false
    },
    LikedPost:{
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

},{
    timestamps:true
})

const Notification=mongoose.model('Notification',NotificationSchema);
module.exports=Notification;