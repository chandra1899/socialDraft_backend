"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose=require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
    },
    setOn: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});
const Otp = mongoose_1.default.model('Otp', otpSchema);
exports.default = Otp;
