const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../models/user');
const bcrypt=require('bcrypt')

passport.use(new LocalStrategy({
    usernameField:'email',
    passReqToCallback:true
    },async (req,email,password,done)=>{
        //find a user and estblish identity
        try {
            let user=await User.findOne({email:email});
                //    console.log('in statergy');
                let match
                if(user)
                   match=await bcrypt.compare(password,user.password);
                //    console.log(match);
            if(!user || !match){
                // console.log('Invalid username/password');
                // return res.status(401)
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

passport.checkAuthentication=(req,res,next)=>{
    // console.log('up auth');
    // console.log(req.session);
    if(req.isAuthenticated()){
    // console.log('yes auth');
        return next();
    }
    console.log('not auth');
    return res.status(401).json({msg:"not authenticated"})
}

passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    // console.log('im in setauth');
    next();
}

module.exports=passport;