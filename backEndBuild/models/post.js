"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose=require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    content: {
        type: String
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['Retweet', 'Post']
    },
    retweetedRef: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Post'
    },
    //include all the ids of comments in an array
    comments: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    photo: {
        data: Buffer,
        contentType: String
    },
    isPhoto: {
        type: Boolean,
        default: false
    },
    retweets: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Retweet'
        }
    ],
}, {
    timestamps: true
});
const Post = mongoose_1.default.model('Post', postSchema);
exports.default = Post;
