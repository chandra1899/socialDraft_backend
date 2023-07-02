const express = require('express');
const router = express.Router();
const userController=require('../../controllers/user_controller')
const passport=require('passport')
const formidable=require('formidable')

router.post('/create',formidable(),userController.create)
router.post('/update',formidable(),passport.checkAuthentication,userController.update);
router.get('/userAvatar/:id',userController.userAvatar);
router.post('/create-session',(req,res,next)=>{
    passport.authenticate('local',async (err,user,info)=>{
        if(err){
            return res.status(500).json({err})
        }
        if(!user){
            return res.status(401).json({msg:"no user found"})
        }
        await req.logIn(user,(err)=>{
            if(err) return res.status(500).json({err})
            next();
        });
        
    })(req, res, next);
}, userController.createSession);
router.get('/sign-out', userController.destroySession);
router.post('/sendOtp', userController.sendOTP);
router.post('/verifyOtp', userController.verifyOtp);
router.get('/getuser',passport.checkAuthentication, userController.getuser);
router.get('/userdetails/:id', userController.userdetails);
router.get('/getReceiver/:id', userController.getReceiver);

//google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email'] }));
router.get('/auth/google/callback',passport.authenticate('google',{successRedirect:'http://localhost:5173/',failureRedirect:'/users/sign-in'}),userController.createSession);

//facebook
router.get('/auth/facebook',passport.authenticate('facebook',{ scope :'email' }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {successRedirect:'http://localhost:5173/',failureRedirect:'/users/sign-in'}));


module.exports = router;