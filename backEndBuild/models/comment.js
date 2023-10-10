"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose=require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true
    },
    //comment belong to a user
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
}, {
    timestamps: true
});
const Comment = mongoose_1.default.model('Comment', commentSchema);
exports.default = Comment;
