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
exports.userAvatar = exports.verifyOtp = exports.sendOTP = exports.getReceiver = exports.userdetails = exports.getuser = exports.destroySession = exports.createSession = exports.create = exports.update = void 0;
const user_1 = __importDefault(require("../models/user"));
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
const fs_1 = __importDefault(require("fs"));
// import path from 'path'
const OTP_1 = __importDefault(require("../models/OTP"));
const otp_1 = __importDefault(require("../mailers/otp"));
const signUp_1 = __importDefault(require("../mailers/signUp"));
const formidable_1 = __importDefault(require("formidable"));
// const User=require('../models/user')
// const bcrypt=require('bcrypt')
// const jwt=require('jsonwebtoken')
// const fs=require('fs');
// const path=require('path');
// const Otp=require('../models/OTP');
// const nodeMailer=require('../mailers/otp');
// const signUpMail=require('../mailers/signUp');
// const formidable=require('formidable')
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)({});
        form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            // console.log(fields, files);
            let user = yield user_1.default.findById(req.user._id);
            console.log('files===', files);
            user.name = fields.name;
            user.description = fields.description;
            if (files.avatar) {
                user.avatar.data = fs_1.default.readFileSync(files.avatar.filepath);
                user.avatar.contentType = files.avatar.mimetype;
                user.photoLocal = false;
            }
            user.save();
            return res.status(200).json({ user });
        }));
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
exports.update = update;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)({});
        form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            // console.log(fields, files);
            if (fields.password != fields.confirm_password) {
                return res.status(401).json({ error: "password and confirm_password does not match" });
            }
            let candidate = yield user_1.default.findOne({ email: fields.email });
            console.log('files===', files);
            if (!candidate) {
                let user = yield user_1.default.create(fields);
                if (fields.latest !== 'avatar_1' && fields.latest !== 'avatar_2' && fields.latest !== 'avatar_3') {
                    user.avatar.data = fs_1.default.readFileSync((_a = files === null || files === void 0 ? void 0 : files.avatar) === null || _a === void 0 ? void 0 : _a.filepath);
                    user.avatar.contentType = (_b = files === null || files === void 0 ? void 0 : files.avatar) === null || _b === void 0 ? void 0 : _b.mimetype;
                    user.photoLocal = false;
                }
                else {
                    user.photoLocal_path = 'default_avatars/' + fields.latest + '.png';
                    user.photoLocal = true;
                }
                user.save();
                signUp_1.default.signUp(user === null || user === void 0 ? void 0 : user.email);
                return res.status(200).json({ msg: "successfully created user" });
            }
            else {
                res.status(400).json({ error: "user already exites" });
            }
        }));
    }
    catch (err) {
        console.log("error in creating user in database", err);
        return res.status(500).json({ error: err });
    }
});
exports.create = create;
const createSession = (req, res) => {
    console.log('sucesfully logged in');
    return res.status(200).json({ msg: "sucessfully created session" });
};
exports.createSession = createSession;
const destroySession = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.status(200).json({ msg: "successfully signed out" });
    });
};
exports.destroySession = destroySession;
const getuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            let can = req.user;
            return yield res.status(200).json({ can });
        }
        else {
            return res.status(404).json({ msg: "no user" });
        }
    }
    catch (err) {
        return res.status(404).json({ msg: "error in getting user", error: err });
    }
});
exports.getuser = getuser;
const userdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findById(req.params.id).select("-avatar").populate({
            path: 'posts',
            select: '-photo',
            populate: {
                path: 'user',
                select: '-avatar'
            }
        }).populate('followers');
        let posts = yield user.posts;
        return res.status(200).json({ user, posts });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
exports.userdetails = userdetails;
const getReceiver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findById(req.params.id).select("-avatar");
        return res.status(200).json({ user });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
exports.getReceiver = getReceiver;
const generateOtp = () => {
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = req.body.email;
        let otp = generateOtp();
        let OTP = yield OTP_1.default.findOne({ email: email });
        if (OTP) {
            if (Date.now() - OTP.setOn > 600000) {
                OTP.setOn = Date.now();
                OTP.otp = otp;
                yield OTP.save();
                otp_1.default.sendOtp(email, otp);
            }
            else {
                otp_1.default.sendOtp(email, OTP.otp);
            }
        }
        else {
            let newOtp = yield OTP_1.default.create({
                email: email,
                otp: otp,
                setOn: Date.now()
            });
            otp_1.default.sendOtp(newOtp.email, newOtp.otp);
        }
        return res.status(200).json({ email });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});
exports.sendOTP = sendOTP;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        if (req.body.password !== req.body.confirm_password) {
            return res.status(400).json({ msg: 'password doesnot match' });
        }
        let email = req.body.email;
        console.log("email====", req.body);
        let OTP = yield OTP_1.default.findOne({ email: email });
        if (OTP.otp !== req.body.otp) {
            return res.status(401).json({ msg: 'otp is not valid' });
        }
        let user = yield user_1.default.findOne({ email: email });
        user.password = req.body.password;
        yield user.save();
        return res.status(200).json({ msg: 'sucessfully changed password' });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
});
exports.verifyOtp = verifyOtp;
const userAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findById(req.params.id).select('avatar');
        if (user.avatar.data) {
            res.set('Content-type', user.avatar.contentType);
            return res.status(200).send(user.avatar.data);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.userAvatar = userAvatar;
