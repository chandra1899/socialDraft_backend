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
exports.toggleRetweet = void 0;
const user_1 = __importDefault(require("../models/user"));
const retweet_1 = __importDefault(require("../models/retweet"));
const post_1 = __importDefault(require("../models/post"));
const comment_1 = __importDefault(require("../models/comment"));
const bookmark_1 = __importDefault(require("../models/bookmark"));
const like_1 = __importDefault(require("../models/like"));
// const User=require('../models/user');
// const Retweet=require('../models/retweet');
// const Post=require('../models/post');
// const Comment=require('../models/comment');
// const Bookmark=require('../models/bookmark')
// const Like=require('../models/like')
const toggleRetweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.default.findById(req.user._id);
    let deleted = false;
    let retweetedpost = yield post_1.default.findById(req.query.id);
    let existing = yield retweet_1.default.findOne({
        user: req.user._id,
        retweet: req.query.id
    });
    if (existing) {
        yield retweet_1.default.findOneAndDelete({
            user: req.user._id,
            retweet: req.query.id
        });
        let retweetP = yield post_1.default.findOne({
            type: 'Retweet',
            user: req.user._id,
            retweetedRef: req.query.id
        }).populate('user').populate('comments');
        let comments = retweetP === null || retweetP === void 0 ? void 0 : retweetP.comments;
        yield like_1.default.deleteMany({ likable: retweetP === null || retweetP === void 0 ? void 0 : retweetP._id, onModel: 'Post' });
        for (let comment of comments) {
            yield like_1.default.deleteMany({ _id: { $in: comment.likes } });
        }
        yield comment_1.default.deleteMany({ post: retweetP === null || retweetP === void 0 ? void 0 : retweetP._id });
        yield bookmark_1.default.deleteMany({ bookmark: retweetP === null || retweetP === void 0 ? void 0 : retweetP._id });
        yield post_1.default.findOneAndDelete({
            type: 'Retweet',
            user: req.user._id,
            retweetedRef: req.query.id
        });
        user.retweets.pull(existing._id);
        user.save();
        retweetedpost === null || retweetedpost === void 0 ? void 0 : retweetedpost.retweets.pull(existing._id);
        retweetedpost === null || retweetedpost === void 0 ? void 0 : retweetedpost.save();
        deleted = true;
        res.status(200).json({ deleted });
    }
    else {
        let newRetweet = yield retweet_1.default.create({
            user: req.user._id,
            retweet: req.query.id
        });
        let post = yield post_1.default.create({
            type: 'Retweet',
            user: req.user._id,
            retweetedRef: req.query.id
        });
        post = yield post.populate([
            { path: 'user' },
            { path: 'likes' },
            { path: 'retweetedRef', populate: { path: 'user' } }
        ]);
        user.retweets.push(newRetweet._id);
        user.save();
        retweetedpost === null || retweetedpost === void 0 ? void 0 : retweetedpost.retweets.push(newRetweet._id);
        retweetedpost === null || retweetedpost === void 0 ? void 0 : retweetedpost.save();
        res.status(200).json({ deleted, post });
    }
    return;
});
exports.toggleRetweet = toggleRetweet;
