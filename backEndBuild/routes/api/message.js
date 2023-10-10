"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const message_controller_1 = require("../../controllers/message_controller");
// const express = require('express');
// const router = express.Router();
// const passport=require('passport');
// const {addMessage,getMessages}=require('../../controllers/message_controller')
router.post('/addMessage', passport_1.default.checkAuthentication, message_controller_1.addMessage);
router.post('/getMessages', passport_1.default.checkAuthentication, message_controller_1.getMessages);
module.exports = router;
