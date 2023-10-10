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
const user_1 = __importDefault(require("../models/user"));
const bookmark_1 = __importDefault(require("../models/bookmark"));
// import { Request, Response } from 'express';
// const User=require('../models/user');
// const Bookmark=require('../models/bookmark')
const toggleBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.default.findById(req.user._id);
    let deleted = false;
    let existing = yield bookmark_1.default.findOne({
        user: req.user._id,
        bookmark: req.query.id
    });
    if (existing) {
        yield bookmark_1.default.findOneAndDelete({
            user: req.user._id,
            bookmark: req.query.id
        });
        user.bookmark.pull(existing._id);
        user.save();
        deleted = true;
        res.status(200).json({ deleted });
    }
    else {
        let newBookmark = yield bookmark_1.default.create({
            user: req.user._id,
            bookmark: req.query.id
        });
        user.bookmark.push(newBookmark._id);
        user.save();
        res.status(200).json({ deleted });
    }
    return;
});
exports.default = toggleBookmark;
