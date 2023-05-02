const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');

passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },async (req,email,password,done)=>{
        //find a user and estblish identity
        try {
            let user=await User.findOne({email:email});
                   
            if(!user || user.password!=password){
                // console.log('Invalid username/password');
                console.log('error','Invalid Username/Password');
                return done(null,false)
            }
            return done(null, user);
        } catch (error) {
            // console.log("error in finding user -->passport");
           console.log('error',error);
            return done(error);
        }
    }
))

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
    try {
        let user=await User.findById(id);
        return done(null,user);
    
    } catch (error) {
        console.log("error in finding user -->passport");
            return done(error);
    }
});

passport.checkAuthenticatoion=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({msg:"not authenticated"})
}

passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    // console.log(res,res.user);
    next();
}