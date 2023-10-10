"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const home_controller_1 = __importDefault(require("../../controllers/home_controller"));
router.use('/user', require('./user'));
router.use('/post', require('./post'));
router.use('/comment', require('./comment'));
router.use('/like', require('./like'));
router.use('/follow', require('./follow'));
router.use('/bookmark', require('./bookmark'));
router.use('/retweet', require('./retweet'));
router.use('/chat', require('./message'));
router.use('/is', require('./is'));
router.use('/home', home_controller_1.default);
module.exports = router;
