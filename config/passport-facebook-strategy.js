const passport=require('passport');
const FacebookStrategy=require('passport-facebook').Strategy;
const crypto=require('crypto');
const User=require('../models/user');
// const HttpsProxyAgent = require('https-proxy-agent');
// const agent = new HttpsProxyAgent(process.env.HTTP_PROXY || "http://172.31.2.4:8080");
// const env=require('./environment');

const gStrategy=new FacebookStrategy({
    clientID: '1068326004554053',
    clientSecret: 'efc07c87dd27c35d5acee7008efc1b19',
    callbackURL: "http://localhost:8000/api/user/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile.emails);
  }
);

// gStrategy._oauth2.setAgent(agent);

passport.use(gStrategy);

module.exports=passport;