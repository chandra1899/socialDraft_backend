const express=require('express');
const router=express.Router();
const isController=require('../../controllers/is_controller')
const Authenticate=require('../../middlewares/auth')

router.get('/liked',Authenticate,isController.isliked)
router.get('/saved',Authenticate,isController.issaved)
router.get('/follow',Authenticate,isController.isfollow)

module.exports=router;