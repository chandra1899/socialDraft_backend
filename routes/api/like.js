const express=require('express');
const router=express.Router();
const likeController=require('../../controllers/like_controller')
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport')


router.post('/',passport.checkAuthentication,likeController.toggleLike)

module.exports=router;