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
const Follow = require('../models/follow');
module.exports.togglefollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let deleted = false;
        let father = yield User.findById(req.query.id);
        let son = yield User.findById(req.user._id);
        let existingFollow = yield Follow.findOne({
            user: req.user._id,
            followable: req.query.id
        });
        if (existingFollow) {
            son.following.pull(existingFollow._id);
            son.save();
            father.followers.pull(existingFollow._id);
            father.save();
            yield Follow.findOneAndDelete({
                user: req.user._id,
                followable: father._id
            });
            deleted = true;
            res.status(200).json({ deleted });
        }
        else {
            let newfollow = yield Follow.create({
                user: req.user._id,
                followable: father._id
            });
            son.following.push(newfollow._id);
            son.save();
            father.followers.push(newfollow._id);
            father.save();
            res.status(200).json({ deleted });
        }
        return;
    }
    catch (err) {
        return res.status(404).json({ error: err });
    }
});
module.exports.yourfollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield User.findById(req.user._id).populate({
            path: 'following',
            populate: {
                path: 'followable'
            }
        });
        let following = yield user.following;
        return res.status(200).json({ following });
    }
    catch (err) {
        return res.status(500).json({ err });
    }
});
