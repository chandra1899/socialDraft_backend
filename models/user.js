const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

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
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
},{
    timestamps:true
});


//hash password
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

const User=mongoose.model('User',userSchema);

module.exports=User;