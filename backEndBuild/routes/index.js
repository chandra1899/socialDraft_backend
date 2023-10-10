"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const home_controller_1 = __importDefault(require("../controllers/home_controller"));
// const express=require('express');
// const router=express.Router();
// const homeController=require('../controllers/home_controller')
// const passport=require('passport')
router.use('/api', require('./api'));
router.use('/', home_controller_1.default.home);
module.exports = router;
