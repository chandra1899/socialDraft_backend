const express = require('express');
const router = express.Router();
const userController=require('../../controllers/user_controller')
const passport=require('passport')
const User=require('../../models/user')
const authenticate=require('../../middlewares/auth')

router.post('/create',userController.create)
router.post('/destroy/:id',async (req,res)=>{
    try {
        let id=req.params.id;
    console.log(id);
    await User.findByIdAndDelete(id);
    console.log("deleted");
    return ;
        
    } catch (err) {
        console.log("unable to delete user");
        return ;
    }
})
router.post('/sign-in',userController.signIn);
router.post('/update',authenticate,userController.update);
router.post('/create-session',(req,res,next)=>{
    // console.log('hello');
    passport.authenticate('local',async (err,user,info)=>{
        if(err){
            return res.status(500).json({err})
        }
        if(!user){
            return res.status(401).json({msg:"no user found"})
        }
        // console.log(user);
        await req.logIn(user,(err)=>{
            if(err) return res.status(500).json({err})
            next();
        });
        
    })(req, res, next);
}, userController.createSession);
router.get('/sign-out', userController.destroySession);
router.get('/getuser',passport.checkAuthentication, userController.getuser);
router.get('/userdetails/:id', userController.userdetails);

//google
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email'] }));
router.get('/auth/google/callback',passport.authenticate('google',{successRedirect:'http://localhost:5173/',failureRedirect:'/users/sign-in'}),userController.createSession);

//facebook
router.get('/auth/facebook',passport.authenticate('facebook',{scope:['profile','email']}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {successRedirect:'http://localhost:5173/',failureRedirect:'/users/sign-in'}));


module.exports = router;
// (req,res,next)=>{
//     req.body.email=req.body.Email;
//     req.body.password=req.body.Password;
//     console.log(req.body);
//     next();},