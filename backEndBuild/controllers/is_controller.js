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
const Like = require('../models/like');
const Bookmark = require('../models/bookmark');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Follow = require('../models/follow');
const User = require('../models/user');
const Retweet = require('../models/retweet');
module.exports.isliked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likeexist = false;
        let like = yield Like.findOne({
            likable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });
        if (like) {
            likeexist = true;
        }
        let likes;
        if (req.query.type == 'Post') {
            let post = yield Post.findById(req.query.id);
            likes = post.likes.length;
        }
        else {
            let comment = yield Comment.findById(req.query.id);
            likes = comment.likes.length;
        }
        return res.status(200).json({ likeexist, likes });
    }
    catch (err) {
        return res.status(404).json({ error: err });
    }
});
module.exports.issaved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let bookmarkexist = false;
        let bookmark = yield Bookmark.findOne({
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
module.exports.isfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let followexist = false;
        let follow = yield Follow.findOne({
            user: req.user._id,
            followable: req.query.id
        });
        if (follow) {
            followexist = true;
        }
        let user = yield User.findById(req.query.id);
        let followers = user.followers.length;
        return res.status(200).json({ followexist, followers });
    }
    catch (err) {
        return res.status(404).json({ error: err });
    }
});
module.exports.retweeted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let retweetexist = false;
        let retweet = yield Retweet.findOne({
            retweet: req.query.id,
            user: req.user._id
        });
        if (retweet) {
            retweetexist = true;
        }
        let post = yield Post.findById(req.query.id);
        let retweets = post.retweets.length;
        return res.status(200).json({ retweetexist, retweets });
    }
    catch (error) {
        return res.status(404).json({ error });
    }
});
