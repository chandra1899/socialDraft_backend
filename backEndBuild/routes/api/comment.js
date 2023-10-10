"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const comment_controller_1 = require("../../controllers/comment_controller");
// const express = require('express');
// const router = express.Router();
// const passport=require('passport');
// const {create,destroy}=require('../../controllers/comment_controller')
router.post('/create', passport_1.default.checkAuthentication, comment_controller_1.create);
router.get('/delete/:id', passport_1.default.checkAuthentication, comment_controller_1.destroy);
module.exports = router;
