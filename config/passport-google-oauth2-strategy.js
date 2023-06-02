const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const signUpMail=require('../mailers/signUp');

// const HttpsProxyAgent = require('https-proxy-agent');
// const agent = new HttpsProxyAgent(process.env.HTTP_PROXY || "http://172.31.2.4:8080");
// const env=require('./environment');

const gStrategy=new googleStrategy({
   clientID:'976308820627-eh73r6oq4s3rigvpk34e436lplfrkmn8.apps.googleusercontent.com',
   clientSecret:'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',
   callbackURL:'http://localhost:8000/api/user/auth/google/callback'
    },async (accessToken,refreshToken,profile,done)=>{
        try {
            let user=await User.findOne({email:profile.emails[0].value}).exec();
            console.log(profile);
            if(user){
                return done(null,user);
            }else{
                try {
                    let person=await User.create({
                        name:profile.displayName,
                        email:profile.emails[0].value,
                        password:crypto.randomBytes(20).toString('hex')
                    })
                    signUpMail.signUp(person.email)
                    return done(null,person);
                } catch (err) {
                    console.log("error in  creating user google passport",err);
                    return ;
                }

            }
        } catch (err) {
            console.log("error in google strategy passport",err);
            return ;
        }
    }
);

// gStrategy._oauth2.setAgent(agent);

passport.use(gStrategy);

module.exports=passport;