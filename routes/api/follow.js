const express=require('express');
const router=express.Router();
const followController=require('../../controllers/follow_controller')
const Authenticate=require('../../middlewares/auth')



router.get('/following',Authenticate,followController.yourfollowing);
router.post('/',Authenticate,followController.togglefollow);

module.exports=router;