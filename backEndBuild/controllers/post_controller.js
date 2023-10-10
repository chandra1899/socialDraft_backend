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
exports.postPhoto = exports.savedposts = exports.getpost = exports.yourretweets = exports.yourposts = exports.destroy = exports.create = void 0;
const post_1 = __importDefault(require("../models/post"));
const comment_1 = __importDefault(require("../models/comment"));
const user_1 = __importDefault(require("../models/user"));
const bookmark_1 = __importDefault(require("../models/bookmark"));
const like_1 = __importDefault(require("../models/like"));
const retweet_1 = __importDefault(require("../models/retweet"));
const fs_1 = __importDefault(require("fs"));
const formidable_1 = __importDefault(require("formidable"));
// const Post=require('../models/post');
// const Comment=require('../models/comment');
// const User=require('../models/user')
// const Bookmark=require('../models/bookmark')
// const Like=require('../models/like')
// const Retweet=require('../models/retweet')
// const fs=require('fs');
// const path=require('path');
// const formidable=require('formidable')
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const form = (0, formidable_1.default)({});
        form.parse(req, (err, fields, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            // console.log(fields, files);
            let user = yield user_1.default.findById(req.user._id);
            const { postPhoto } = files;
            let newpost = yield post_1.default.create({
                content: fields.content,
                user: req.user._id
            });
            user.posts.push(newpost);
            if (files.postPhoto && newpost.photo) {
                newpost.photo.data = fs_1.default.readFileSync(postPhoto === null || postPhoto === void 0 ? void 0 : postPhoto.filepath);
                newpost.photo.contentType = postPhoto === null || postPhoto === void 0 ? void 0 : postPhoto.mimetype;
                newpost.isPhoto = true;
            }
            user.save();
            newpost.save();
            let post = yield post_1.default.findById(newpost._id).select("-photo").populate('user');
            return res.status(200).json({ post });
        }));
    }
    catch (error) {
        return res.status(500).json({ error: error });
    }
});
exports.create = create;
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        let post = yield post_1.default.findById(req.params.id).populate('user').populate('comments');
        let comments = yield (post === null || post === void 0 ? void 0 : post.comments);
        if (((_a = post === null || post === void 0 ? void 0 : post.user) === null || _a === void 0 ? void 0 : _a.id) == req.user._id) {
            yield like_1.default.deleteMany({ likable: post === null || post === void 0 ? void 0 : post._id, onModel: 'Post' });
            for (let comment of comments) {
                yield like_1.default.deleteMany({ _id: { $in: comment.likes } });
            }
            yield comment_1.default.deleteMany({ post: req.params.id });
            yield user_1.default.findByIdAndUpdate((_b = post === null || post === void 0 ? void 0 : post.user) === null || _b === void 0 ? void 0 : _b._id, { $pull: { posts: req.params.id } });
            yield bookmark_1.default.deleteMany({ bookmark: req.params.id });
            // if(post.photo){
            //     fs.unlinkSync(path.join(__dirname,'..','..',post.photo));
            // }
            let retweetedPosts = yield post_1.default.find({
                type: 'Retweet',
                retweetedRef: req.params.id
            });
            for (let retweetedPost of retweetedPosts) {
                let retweet = yield post_1.default.findById(retweetedPost._id).populate('user').populate('comments');
                let retweetcomments = yield (retweet === null || retweet === void 0 ? void 0 : retweet.comments);
                yield like_1.default.deleteMany({ likable: retweet === null || retweet === void 0 ? void 0 : retweet._id, onModel: 'Post' });
                for (let retweetcomment of retweetcomments) {
                    yield like_1.default.deleteMany({ _id: { $in: retweetcomment.likes } });
                }
                yield comment_1.default.deleteMany({ post: retweet === null || retweet === void 0 ? void 0 : retweet._id });
                yield bookmark_1.default.deleteMany({ bookmark: retweet === null || retweet === void 0 ? void 0 : retweet._id });
                let retweetedUser = yield user_1.default.findById((_c = retweet === null || retweet === void 0 ? void 0 : retweet.user) === null || _c === void 0 ? void 0 : _c._id);
                let existingretweet = yield retweet_1.default.findOne({
                    user: retweetedUser._id,
                    retweet: req.params.id
                });
                retweetedUser.retweets.pull(existingretweet === null || existingretweet === void 0 ? void 0 : existingretweet._id);
                retweetedUser.save();
                yield retweet_1.default.findByIdAndDelete(existingretweet === null || existingretweet === void 0 ? void 0 : existingretweet._id);
                yield post_1.default.findByIdAndDelete(retweet === null || retweet === void 0 ? void 0 : retweet._id);
            }
            yield post_1.default.findByIdAndDelete(post === null || post === void 0 ? void 0 : post._id);
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
exports.destroy = destroy;
const yourposts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_1.default.findById(req.user._id).populate({
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
exports.yourposts = yourposts;
const yourretweets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.yourretweets = yourretweets;
const getpost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield post_1.default.findById(req.params.id).select("-photo")
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
exports.getpost = getpost;
const savedposts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let savedposts = yield bookmark_1.default.find({ user: req.user._id })
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
exports.savedposts = savedposts;
const postPhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        let post = yield post_1.default.findById(req.params.id).select('photo');
        if ((_d = post === null || post === void 0 ? void 0 : post.photo) === null || _d === void 0 ? void 0 : _d.data) {
            res.set('Content-type', post.photo.contentType);
            return res.status(200).send(post.photo.data);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.postPhoto = postPhoto;
