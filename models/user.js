const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const multer=require(('multer'));
const path=require('path');
const AVATAR_PATH=path.join('/frontend/src/assets/uploads/users/avatar');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follow'
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follow'
    }],
    bookmark:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    description:{
        type:String
    },
    avatar:{
        type:String
    }
},{
    timestamps:true
});


// hash password
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,12);
    }
    next();
})

userSchema.methods.generateAuthToken=async function(){
    try {
        let tok=await jwt.sign({_id:this._id},"something");
        this.tokens=await this.tokens.concat({token:tok})
        await this.save();
        return tok;
    } catch (err) {
        console.log(err);
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..','..',AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
//   const upload = multer({ storage: storage })
//statics
userSchema.statics.uploadedAvatar=multer({ storage: storage }).single('avatar'); 
userSchema.statics.avatarPath=AVATAR_PATH; 

const User=mongoose.model('User',userSchema);

module.exports=User;