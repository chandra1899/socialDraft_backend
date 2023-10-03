import express from 'express'
const router = express.Router();
import passport from 'passport'
import {toggleLike} from '../../controllers/like_controller'

// const express=require('express');
// const router=express.Router();
// const {toggleLike}=require('../../controllers/like_controller')
// const passport=require('passport')


router.post('/',passport.checkAuthentication,toggleLike)

module.exports=router;