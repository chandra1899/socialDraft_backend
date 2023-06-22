const express=require('express');
const router=express.Router();
const isController=require('../../controllers/is_controller')
const passport=require('passport')

router.get('/liked',passport.checkAuthentication,isController.isliked)
router.get('/saved',passport.checkAuthentication,isController.issaved)
router.get('/retweeted',passport.checkAuthentication,isController.retweeted)
router.get('/follow',passport.checkAuthentication,isController.isfollow)

module.exports=router;