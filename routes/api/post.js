const express=require('express');
const router=express.Router();
const postsController=require('../../controllers/post_controller')
// const passport=require('passport')
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport')

router.post('/create',passport.checkAuthentication,postsController.create);
router.get('/delete/:id',passport.checkAuthentication,postsController.destroy);
router.get('/yourposts',passport.checkAuthentication,postsController.yourposts);
router.get('/getpost/:id',postsController.getpost);
router.get('/savedposts',passport.checkAuthentication,postsController.savedposts);
router.get('/yourretweets',passport.checkAuthentication,postsController.yourretweets);
// router.get('/destroy/:id',passport.checkAuthenticatoion,postsController.destroy);

module.exports=router;