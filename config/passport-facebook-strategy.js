const passport=require('passport');
const FacebookStrategy=require('passport-facebook').Strategy;
const crypto=require('crypto');
const User=require('../models/user');

const gStrategy=new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACKURL,
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile.emails);
  }
);

passport.use(gStrategy);

module.exports=passport;