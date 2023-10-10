"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const signUpMail = require('../mailers/signUp');
const gStrategy = new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACKURL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.findOne({ email: profile.emails[0].value }).exec();
        if (user) {
            return done(null, user);
        }
        else {
            try {
                let person = yield User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                    photoLocal: true,
                    photoLocal_path: 'default_avatars/avatar_1.png'
                });
                signUpMail.signUp(person.email);
                return done(null, person);
            }
            catch (err) {
                console.log("error in  creating user google passport", err);
                return;
            }
        }
    }
    catch (err) {
        console.log("error in google strategy passport", err);
        return;
    }
}));
passport.use(gStrategy);
module.exports = passport;
