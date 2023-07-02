const express=require('express');
const router=express.Router();
const postsController=require('../../controllers/post_controller')
const {create,destroy,yourposts,getpost,savedposts,yourretweets,postPhoto}=require('passport')
const formidable=require('formidable');

router.post('/create',passport.checkAuthentication,formidable(),create);
router.get('/delete/:id',passport.checkAuthentication,destroy);
router.get('/yourposts',passport.checkAuthentication,yourposts);
router.get('/getpost/:id',getpost);
router.get('/savedposts',passport.checkAuthentication,savedposts);
router.get('/yourretweets',passport.checkAuthentication,yourretweets);
router.get('/postPhoto/:id',postPhoto);

module.exports=router;