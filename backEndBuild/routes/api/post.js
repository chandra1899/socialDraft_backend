"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("passport"));
const post_controller_1 = require("../../controllers/post_controller");
// const express=require('express');
// const router=express.Router();
// const {create,destroy,yourposts,getpost,savedposts,yourretweets,postPhoto}=require('../../controllers/post_controller')
// const passport=require('passport')
router.post('/create', passport_1.default.checkAuthentication, post_controller_1.create);
router.get('/delete/:id', passport_1.default.checkAuthentication, post_controller_1.destroy);
router.get('/yourposts', passport_1.default.checkAuthentication, post_controller_1.yourposts);
router.get('/getpost/:id', post_controller_1.getpost);
router.get('/savedposts', passport_1.default.checkAuthentication, post_controller_1.savedposts);
router.get('/yourretweets', passport_1.default.checkAuthentication, post_controller_1.yourretweets);
router.get('/postPhoto/:id', post_controller_1.postPhoto);
module.exports = router;
