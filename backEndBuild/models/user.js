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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require(('multer'));
const path = require('path');
const AVATAR_PATH = path.join('/socialDraft_frontend/src/assets/uploads/users/avatar');
const AVATAR_PATH_A = path.join('/socialDraft_frontend/src/assets');
const POST_PATH = path.join('/socialDraft_frontend/src/assets/uploads/users/posts');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
    followers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Follow'
        }],
    following: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Follow'
        }],
    bookmark: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
    description: {
        type: String
    },
    avatar: {
        data: Buffer,
        contentType: String
    },
    retweets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Retweet'
        }
    ],
    photoLocal: {
        type: Boolean
    },
    photoLocal_path: {
        type: String
    }
}, {
    timestamps: true
});
// hash password
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield bcrypt.hash(this.password, 12);
        }
        next();
    });
});
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tok = yield jwt.sign({ _id: this._id }, "something");
            this.tokens = yield this.tokens.concat({ token: tok });
            yield this.save();
            return tok;
        }
        catch (err) {
            console.log(err);
        }
    });
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == 'avatar')
            cb(null, path.join(__dirname, '..', '..', AVATAR_PATH));
        else
            cb(null, path.join(__dirname, '..', '..', POST_PATH));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
//   const upload = multer({ storage: storage })
//statics
userSchema.statics.uploadedAvatar = multer({ storage: storage }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'postPhoto', maxCount: 1 }
]);
userSchema.statics.avatarPath = AVATAR_PATH;
userSchema.statics.avatarPath_a = AVATAR_PATH_A;
userSchema.statics.userPostPath = POST_PATH;
const User = mongoose.model('User', userSchema);
exports.default = User;
