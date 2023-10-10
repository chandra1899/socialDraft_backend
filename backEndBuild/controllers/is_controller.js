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
exports.retweeted = exports.isfollow = exports.issaved = exports.isliked = void 0;
const like_1 = __importDefault(require("../models/like"));
const bookmark_1 = __importDefault(require("../models/bookmark"));
const post_1 = __importDefault(require("../models/post"));
const comment_1 = __importDefault(require("../models/comment"));
const follow_1 = __importDefault(require("../models/follow"));
const user_1 = __importDefault(require("../models/user"));
const retweet_1 = __importDefault(require("../models/retweet"));
// const Like=require('../models/like')
// const Bookmark=require('../models/bookmark')
// const Post=require('../models/post')
// const Comment=require('../models/comment')
// const Follow=require('../models/follow')
// const User=require('../models/user')
// const Retweet=require('../models/retweet')
const isliked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likeexist = false;
        let like = yield like_1.default.findOne({
            likable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });
        if (like) {
            likeexist = true;
        }
        let likes;
        if (req.query.type == 'Post') {
            let post = yield post_1.default.findById(req.query.id);
            likes = post === null || post === void 0 ? void 0 : post.likes.length;
        }
        else {
            let comment = yield comment_1.default.findById(req.query.id);
            likes = comment === null || comment === void 0 ? void 0 : comment.likes.length;
        }
        return res.status(200).json({ likeexist, likes });
    }
    catch (err) {
        return res.status(404).json({ error: err });
    }
});
exports.isliked = isliked;
const issaved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let bookmarkexist = false;
        let bookmark = yield bookmark_1.default.findOne({
            bookmark: req.query.id,
            user: req.user._id
        });
        if (bookmark) {
            bookmarkexist = true;
        }
        return res.status(200).json({ bookmarkexist });
    }
    catch (err) {
        return res.status(404).jason({ error: err });
    }
});
exports.issaved = issaved;
const isfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let followexist = false;
        let follow = yield follow_1.default.findOne({
            user: req.user._id,
            followable: req.query.id
        });
        if (follow) {
            followexist = true;
        }
        let user = yield user_1.default.findById(req.query.id);
        let followers = user.followers.length;
        return res.status(200).json({ followexist, followers });
    }
    catch (err) {
        return res.status(404).json({ error: err });
    }
});
exports.isfollow = isfollow;
const retweeted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let retweetexist = false;
        let retweet = yield retweet_1.default.findOne({
            retweet: req.query.id,
            user: req.user._id
        });
        if (retweet) {
            retweetexist = true;
        }
        let post = yield post_1.default.findById(req.query.id);
        let retweets = post === null || post === void 0 ? void 0 : post.retweets.length;
        return res.status(200).json({ retweetexist, retweets });
    }
    catch (error) {
        return res.status(404).json({ error });
    }
});
exports.retweeted = retweeted;
