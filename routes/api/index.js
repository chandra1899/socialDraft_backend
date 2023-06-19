const express=require('express');
const router=express.Router();
const homeController=require('../../controllers/home_controller')

router.use('/user',require('./user'))
router.use('/post',require('./post'))
router.use('/comment',require('./comment'))
router.use('/like',require('./like'))
router.use('/follow',require('./follow'))
router.use('/bookmark',require('./bookmark'))
router.use('/retweet',require('./retweet'))
router.use('/chat',require('./message'))
router.use('/is',require('./is'))
router.use('/',homeController.home)

module.exports=router;