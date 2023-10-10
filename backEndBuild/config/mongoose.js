"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
//connecting to mongoDB
mongoose_1.default.connect(process.env.MONGOOSE_URL);
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
db.once('open', function () {
    console.log('Connected to Database :: MongoDB');
});
exports.default = db;
