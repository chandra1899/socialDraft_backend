const express=require('express');
const router=express.Router();
const followController=require('../../controllers/follow_controller')
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport')



router.get('/following',passport.checkAuthentication,followController.yourfollowing);
router.post('/',passport.checkAuthentication,followController.togglefollow);

module.exports=router;