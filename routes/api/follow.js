const express=require('express');
const router=express.Router();
const followController=require('../../controllers/follow_controller')
const passport=require('passport')


router.post('/',passport.checkAuthenticatoion,followController.togglefollow);

module.exports=router;