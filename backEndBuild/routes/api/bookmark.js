"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const bookmark_controller_1 = require("../../controllers/bookmark_controller");
// const express = require('express');
// const router = express.Router();
// const passport=require('passport')
// const {toggleBookmark}=require('../../controllers/bookmark_controller')
router.post('/', passport_1.default.checkAuthentication, bookmark_controller_1.toggleBookmark);
module.exports = router;
