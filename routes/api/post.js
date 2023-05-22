const express=require('express');
const router=express.Router();
const postsController=require('../../controllers/post_controller')
// const passport=require('passport')
const Authenticate=require('../../middlewares/auth')


router.post('/create',Authenticate,postsController.create);
router.get('/yourposts',Authenticate,postsController.yourposts);
router.get('/getpost/:id',postsController.getpost);
router.get('/savedposts',Authenticate,postsController.savedposts);
// router.get('/destroy/:id',passport.checkAuthenticatoion,postsController.destroy);

module.exports=router;