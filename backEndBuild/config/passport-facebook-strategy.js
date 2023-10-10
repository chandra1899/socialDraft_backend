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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const FacebookStrategy = passport_facebook_1.default.Strategy;
const crypto_1 = __importDefault(require("crypto"));
const user_1 = __importDefault(require("../models/user"));
const signUp_1 = __importDefault(require("../mailers/signUp"));
// const passport=require('passport');
// const FacebookStrategy=require('passport-facebook').Strategy;
// const crypto=require('crypto');
// const User=require('../models/user');
// const signUpMail=require('../mailers/signUp');
const gStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACKURL,
    profileFields: ['id', 'displayName', 'photos', 'emails']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(profile.emails);
        if (profile.emails.length === 0)
            return redirect('https://socialdraft.onrender.com');
        let user = yield user_1.default.findOne({ email: profile.emails[0].value }).exec();
        if (user) {
            return done(null, user);
        }
        else if (profile.emails[0].value) {
            try {
                let person = yield user_1.default.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto_1.default.randomBytes(20).toString('hex'),
                    photoLocal: true,
                    photoLocal_path: 'default_avatars/avatar_1.png'
                });
                signUp_1.default.signUp(person.email);
                return done(null, person);
            }
            catch (err) {
                console.log("error in  creating user google passport", err);
                return;
            }
        }
        else {
            return redirect('https://socialdraft.onrender.com');
        }
    }
    catch (error) {
        console.log("error in google strategy passport", error);
        return;
    }
}));
passport_1.default.use(gStrategy);
module.exports = passport_1.default;
