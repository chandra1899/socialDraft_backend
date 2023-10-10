"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const is_controller_1 = require("../../controllers/is_controller");
// const express=require('express');
// const router=express.Router();
// const {isliked,isfollow,issaved,retweeted}=require('../../controllers/is_controller')
// const passport=require('passport')
router.get('/liked', passport_1.default.checkAuthentication, is_controller_1.isliked);
router.get('/saved', passport_1.default.checkAuthentication, is_controller_1.issaved);
router.get('/retweeted', passport_1.default.checkAuthentication, is_controller_1.retweeted);
router.get('/follow', passport_1.default.checkAuthentication, is_controller_1.isfollow);
module.exports = router;
