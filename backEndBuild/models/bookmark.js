"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose=require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const bookmarkSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookmark: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    }
}, {
    timestamps: true
});
const Bookmark = mongoose_1.default.model('Bookmark', bookmarkSchema);
exports.default = Bookmark;
