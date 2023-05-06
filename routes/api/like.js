const express=require('express');
const router=express.Router();
const likeController=require('../../controllers/like_controller')
const passport=require('passport')

router.post('/',passport.checkAuthenticatoion,likeController.toggleLike)

module.exports=router;