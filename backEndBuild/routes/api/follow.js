"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const follow_controller_1 = require("../../controllers/follow_controller");
// const express=require('express');
// const router=express.Router();
// const {yourfollowing,togglefollow}=require('../../controllers/follow_controller')
// const passport=require('passport')
router.get('/following', passport_1.default.checkAuthentication, follow_controller_1.yourfollowing);
router.post('/', passport_1.default.checkAuthentication, follow_controller_1.togglefollow);
module.exports = router;
