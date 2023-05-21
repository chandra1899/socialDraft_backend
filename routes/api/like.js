const express=require('express');
const router=express.Router();
const likeController=require('../../controllers/like_controller')
const Authenticate=require('../../middlewares/auth')


router.post('/',Authenticate,likeController.toggleLike)

module.exports=router;