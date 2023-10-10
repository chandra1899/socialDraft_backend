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
const passport_local_1 = __importDefault(require("passport-local"));
const LocalStrategy = passport_local_1.default.Strategy;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// const passport=require('passport');
// const LocalStrategy=require('passport-local').Strategy;
// const User=require('../models/user');
// const bcrypt=require('bcrypt')
passport_1.default.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    //find a user and estblish identity
    try {
        let user = yield user_1.default.findOne({ email: email });
        let match;
        if (user)
            match = yield bcrypt_1.default.compare(password, user.password);
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
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findById(id);
        return done(null, user);
    }
    catch (error) {
        console.log("error in finding user -->passport");
        return done(error);
    }
}));
passport_1.default.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ msg: "not authenticated" });
};
passport_1.default.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
};
module.exports = passport_1.default;
