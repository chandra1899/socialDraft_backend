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
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Bookmark = require('../models/bookmark');
const Like = require('../models/like');
const Retweet = require('../models/retweet');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
module.exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = formidable({});
        form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            // console.log(fields, files);
            let user = yield User.findById(req.user._id);
            const { postPhoto } = files;
            let newpost = yield Post.create({
                content: fields.content,
                user: req.user._id
            });
            user.posts.push(newpost);
            if (files.postPhoto) {
                newpost.photo.data = fs.readFileSync(postPhoto.filepath);
                newpost.photo.contentType = postPhoto.mimetype;
                newpost.isPhoto = true;
            }
            user.save();
            newpost.save();
            let post = yield Post.findById(newpost._id).select("-photo").populate('user');
            return res.status(200).json({ post });
        }));
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
module.exports.destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield Post.findById(req.params.id).populate('user').populate('comments');
        let comments = yield post.comments;
        if (post.user.id == req.user._id) {
            yield Like.deleteMany({ likable: post._id, onModel: 'Post' });
            for (let comment of comments) {
                yield Like.deleteMany({ _id: { $in: comment.likes } });
            }
            yield Comment.deleteMany({ post: req.params.id });
            yield User.findByIdAndUpdate(post.user._id, { $pull: { posts: req.params.id } });
            yield Bookmark.deleteMany({ bookmark: req.params.id });
            // if(post.photo){
            //     fs.unlinkSync(path.join(__dirname,'..','..',post.photo));
            // }
            let retweetedPosts = yield Post.find({
                type: 'Retweet',
                retweetedRef: req.params.id
            });
            for (let retweetedPost of retweetedPosts) {
                let retweet = yield Post.findById(retweetedPost._id).populate('user').populate('comments');
                let retweetcomments = yield retweet.comments;
                yield Like.deleteMany({ likable: retweet._id, onModel: 'Post' });
                for (let retweetcomment of retweetcomments) {
                    yield Like.deleteMany({ _id: { $in: retweetcomment.likes } });
                }
                yield Comment.deleteMany({ post: retweet._id });
                yield Bookmark.deleteMany({ bookmark: retweet._id });
                let retweetedUser = yield User.findById(retweet.user._id);
                let existingretweet = yield Retweet.findOne({
                    user: retweetedUser._id,
                    retweet: req.params.id
                });
                retweetedUser.retweets.pull(existingretweet._id);
                retweetedUser.save();
                yield Retweet.findByIdAndDelete(existingretweet._id);
                yield Post.findByIdAndDelete(retweet._id);
            }
            yield Post.findByIdAndDelete(post._id);
            return res.status(200).json({ msg: "sucessfully deleted post" });
        }
        else {
            return res.status(402).json({ msg: "can't delete post" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
});
module.exports.yourposts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.findById(req.user._id).populate({
            path: 'posts',
            select: "-photo"
        });
        let yourposts = yield user.posts.reverse();
        return res.status(200).json({ yourposts });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
module.exports.yourretweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield req.user.populate({
            path: 'retweets',
            populate: {
                path: 'retweet',
                select: "-photo",
                populate: {
                    path: 'user'
                }
            }
        });
        let yourretweets = yield user.retweets.reverse();
        return res.status(200).json({ yourretweets });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
module.exports.getpost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield Post.findById(req.params.id).select("-photo")
            .populate('user')
            .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })
            .populate({
            path: 'retweetedRef',
            select: "-photo",
            populate: {
                path: 'user'
            }
        });
        return res.status(200).json({ post });
    }
    catch (err) {
        return res.status(404).json({ err });
    }
});
module.exports.savedposts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let savedposts = yield Bookmark.find({ user: req.user._id })
            .sort('-createdAt')
            .populate({
            path: 'bookmark',
            select: '-photo',
            populate: [{
                    path: 'user'
                },
                { path: 'retweetedRef',
                    select: '-photo',
                    populate: {
                        path: 'user'
                    } }
            ]
        });
        return res.status(200).json({ savedposts });
    }
    catch (err) {
        return res.status(404).json({ err });
    }
});
module.exports.postPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield Post.findById(req.params.id).select('photo');
        if (post.photo.data) {
            res.set('Content-type', post.photo.contentType);
            return res.status(200).send(post.photo.data);
        }
    }
    catch (error) {
        console.log(error);
    }
});
