import express from 'express'
const router = express.Router();
import homeController from '../controllers/home_controller'

// const express=require('express');
// const router=express.Router();
// const homeController=require('../controllers/home_controller')
// const passport=require('passport')

router.use('/api',require('./api'));
router.use('/',homeController)

module.exports=router;