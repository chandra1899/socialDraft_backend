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
const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports.toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likable;
        let deleted = false;
        if (req.query.type == 'Post') {
            likable = yield Post.findById(req.query.id);
        }
        else {
            likable = yield Comment.findById(req.query.id);
        }
        let existingLike = yield Like.findOne({
            likable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });
        if (existingLike) {
            likable.likes.pull(existingLike._id);
            likable.save();
            yield Like.findOneAndRemove({
                likable: req.query.id,
                onModel: req.query.type,
                user: req.user._id
            });
            deleted = true;
        }
        else {
            let newLike = yield Like.create({
                user: req.user._id,
                likable: req.query.id,
                onModel: req.query.type
            });
            likable.likes.push(newLike._id);
            likable.save();
        }
        return res.status(200).json({ deleted: deleted });
    }
    catch (err) {
        return res.status(404).json({ error: `error in making a like :-${err}` });
    }
});
