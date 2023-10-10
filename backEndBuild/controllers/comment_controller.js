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
exports.destroy = exports.create = void 0;
const comment_1 = __importDefault(require("../models/comment"));
const post_1 = __importDefault(require("../models/post"));
const like_1 = __importDefault(require("../models/like"));
// const Comment=require('../models/comment')
// const Post=require('../models/post')
// const Like=require('../models/like')
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let post = yield post_1.default.findById(req.body.post);
        let comment;
        if (post) {
            comment = yield comment_1.default.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            comment = yield comment.populate('user');
            post.comments.push(comment);
            post.save();
            res.status(200).json({ comment });
        }
    }
    catch (err) {
        console.log("error in creating the comment", err);
        return res.status(404).json({ error: err });
    }
});
exports.create = create;
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let comment = yield comment_1.default.findById(req.params.id);
        if ((comment === null || comment === void 0 ? void 0 : comment.user) == req.user.id) {
            let postId = comment === null || comment === void 0 ? void 0 : comment.post;
            yield comment_1.default.findByIdAndDelete(comment === null || comment === void 0 ? void 0 : comment.id);
            yield like_1.default.deleteMany({ likable: comment === null || comment === void 0 ? void 0 : comment._id, onModel: 'Comment' });
            yield post_1.default.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            return res.status(200).json({ msg: "sucessfully deleted comment" });
        }
        else {
            return res.status(402).json({ msg: "can't delete comment" });
        }
    }
    catch (err) {
        console.log("error in deleting the comment", err);
        return res.status(500).json({ error: err });
    }
});
exports.destroy = destroy;
