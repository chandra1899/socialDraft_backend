const mongoose=require('mongoose');

const NotificationSchema=new mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    typeOf:{
        type:String,
        required:true,
        enum:['Liked','Commented', 'Retweeted', 'Messaged', 'Posted']
    },
    read:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const Notification=mongoose.model('Notification',NotificationSchema);
module.exports=Notification;