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
const post_1 = __importDefault(require("../models/post"));
// const Post=require('../models/post')
const home = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = yield post_1.default.find({}).select("-photo")
            .sort('-createdAt')
            .populate({
            path: 'user',
            select: '-avatar'
        })
            .populate('likes')
            .populate({
            path: 'retweetedRef',
            select: '-photo',
            populate: {
                path: 'user',
                select: '-avatar'
            }
        });
        return res.status(200).json({ posts });
    }
    catch (err) {
        return res.status(401).json({ msg: "error in sending post", error: err });
    }
});
exports.default = home;
