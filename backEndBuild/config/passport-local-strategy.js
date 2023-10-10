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
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    //find a user and estblish identity
    try {
        let user = yield User.findOne({ email: email });
        let match;
        if (user)
            match = yield bcrypt.compare(password, user.password);
        if (!user || !match) {
            console.log('error', 'Invalid Username/Password');
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        console.log('error', error);
        return done(error);
    }
})));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.findById(id);
        return done(null, user);
    }
    catch (error) {
        console.log("error in finding user -->passport");
        return done(error);
    }
}));
passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ msg: "not authenticated" });
};
passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
};
module.exports = passport;
