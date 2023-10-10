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
const User = require('../models/user');
const Retweet = require('../models/retweet');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Bookmark = require('../models/bookmark');
const Like = require('../models/like');
module.exports.toggleRetweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield User.findById(req.user._id);
    let deleted = false;
    let retweetedpost = yield Post.findById(req.query.id);
    let existing = yield Retweet.findOne({
        user: req.user._id,
        retweet: req.query.id
    });
    if (existing) {
        yield Retweet.findOneAndDelete({
            user: req.user._id,
            retweet: req.query.id
        });
        let retweetP = yield Post.findOne({
            type: 'Retweet',
            user: req.user._id,
            retweetedRef: req.query.id
        }).populate('user').populate('comments');
        let comments = retweetP.comments;
        yield Like.deleteMany({ likable: retweetP._id, onModel: 'Post' });
        for (let comment of comments) {
            yield Like.deleteMany({ _id: { $in: comment.likes } });
        }
        yield Comment.deleteMany({ post: retweetP._id });
        yield Bookmark.deleteMany({ bookmark: retweetP._id });
        yield Post.findOneAndDelete({
            type: 'Retweet',
            user: req.user._id,
            retweetedRef: req.query.id
        });
        user.retweets.pull(existing._id);
        user.save();
        retweetedpost.retweets.pull(existing._id);
        retweetedpost.save();
        deleted = true;
        res.status(200).json({ deleted });
    }
    else {
        let newRetweet = yield Retweet.create({
            user: req.user._id,
            retweet: req.query.id
        });
        let post = yield Post.create({
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
        retweetedpost.retweets.push(newRetweet._id);
        retweetedpost.save();
        res.status(200).json({ deleted, post });
    }
    return;
});
