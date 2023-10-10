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
exports.toggleLike = void 0;
const like_1 = __importDefault(require("../models/like"));
const comment_1 = __importDefault(require("../models/comment"));
const post_1 = __importDefault(require("../models/post"));
// const Like=require('../models/like');
// const Comment=require('../models/comment');
// const Post=require('../models/post');
const toggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let likable;
        let deleted = false;
        if (req.query.type == 'Post') {
            likable = yield post_1.default.findById(req.query.id);
        }
        else {
            likable = yield comment_1.default.findById(req.query.id);
        }
        let existingLike = yield like_1.default.findOne({
            likable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });
        if (existingLike) {
            likable === null || likable === void 0 ? void 0 : likable.likes.pull(existingLike._id);
            likable === null || likable === void 0 ? void 0 : likable.save();
            yield like_1.default.findOneAndRemove({
                likable: req.query.id,
                onModel: req.query.type,
                user: req.user._id
            });
            deleted = true;
        }
        else {
            let newLike = yield like_1.default.create({
                user: req.user._id,
                likable: req.query.id,
                onModel: req.query.type
            });
            likable === null || likable === void 0 ? void 0 : likable.likes.push(newLike._id);
            likable === null || likable === void 0 ? void 0 : likable.save();
        }
        return res.status(200).json({ deleted: deleted });
    }
    catch (err) {
        return res.status(404).json({ error: `error in making a like :-${err}` });
    }
});
exports.toggleLike = toggleLike;
