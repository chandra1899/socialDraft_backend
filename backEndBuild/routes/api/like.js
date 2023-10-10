"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const like_controller_1 = require("../../controllers/like_controller");
// const express=require('express');
// const router=express.Router();
// const {toggleLike}=require('../../controllers/like_controller')
// const passport=require('passport')
router.post('/', passport_1.default.checkAuthentication, like_controller_1.toggleLike);
module.exports = router;
