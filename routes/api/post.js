const express=require('express');
const router=express.Router();
const postsController=require('../../controllers/post_controller')

router.post('/create',passport.checkAuthenticatoion,postsController.create);
router.get('/destroy/:id',passport.checkAuthenticatoion,postsController.destroy);

module.exports=router;