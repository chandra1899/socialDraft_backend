import express from 'express'
const router = express.Router();
import passport from 'passport'
import {yourfollowing,togglefollow} from '../../controllers/follow_controller'

// const express=require('express');
// const router=express.Router();
// const {yourfollowing,togglefollow}=require('../../controllers/follow_controller')
// const passport=require('passport')

router.get('/following',passport.checkAuthentication,yourfollowing);
router.post('/',passport.checkAuthentication,togglefollow);

module.exports=router;