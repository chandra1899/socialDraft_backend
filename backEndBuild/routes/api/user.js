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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const user_controller_1 = require("../../controllers/user_controller");
// const express = require('express');
// const router = express.Router();
// const {create,update,userAvatar,createSession,destroySession,sendOTP,verifyOtp,getuser,userdetails,getReceiver}=require('../../controllers/user_controller')
// const passport=require('passport')
router.post('/create', user_controller_1.create);
router.post('/update', passport_1.default.checkAuthentication, user_controller_1.update);
router.get('/userAvatar/:id', user_controller_1.userAvatar);
router.post('/create-session', (req, res, next) => {
    passport_1.default.authenticate('local', (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(500).json({ err });
        }
        if (!user) {
            return res.status(401).json({ msg: "no user found" });
        }
        yield req.logIn(user, (err) => {
            if (err)
                return res.status(500).json({ err });
            next();
        });
    }))(req, res, next);
}, user_controller_1.createSession);
router.get('/sign-out', user_controller_1.destroySession);
router.post('/sendOtp', user_controller_1.sendOTP);
router.post('/verifyOtp', user_controller_1.verifyOtp);
router.get('/getuser', passport_1.default.checkAuthentication, user_controller_1.getuser);
router.get('/userdetails/:id', user_controller_1.userdetails);
router.get('/getReceiver/:id', user_controller_1.getReceiver);
//google
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport_1.default.authenticate('google', { successRedirect: 'https://socialdraft.onrender.com', failureRedirect: 'https://socialdraft.onrender.com' }), user_controller_1.createSession);
//facebook
router.get('/auth/facebook', passport_1.default.authenticate('facebook', { scope: 'email' }));
router.get('/auth/facebook/callback', passport_1.default.authenticate('facebook', { successRedirect: 'https://socialdraft.onrender.com', failureRedirect: 'https://socialdraft.onrender.com' }), user_controller_1.createSession);
module.exports = router;
