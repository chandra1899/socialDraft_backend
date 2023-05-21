const express=require('express');
const router=express.Router();
const isController=require('../../controllers/is_controller')
const Authenticate=require('../../middlewares/auth')

router.get('/liked',Authenticate,isController.isliked)
router.get('/saved',Authenticate,isController.issaved)

module.exports=router;