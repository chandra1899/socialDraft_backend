"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose=require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const retweetSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    retweet: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
}, {
    timestamps: true
});
const Retweet = mongoose_1.default.model('Retweet', retweetSchema);
exports.default = Retweet;
