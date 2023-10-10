"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose=require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    message: {
        text: {
            type: String,
            required: true
        },
    },
    users: Array,
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
});
MessageSchema;
const Message = mongoose_1.default.model('Message', MessageSchema);
exports.default = Message;
