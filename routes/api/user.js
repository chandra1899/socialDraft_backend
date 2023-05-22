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
router.post('/sign-in', userController.signIn);
router.post('/update',authenticate,userController.update);
router.post('/create-session',(req,res,next)=>{
    req.body.email=req.body.Email;
    req.body.password=req.body.Password;
    console.log(req.body);
    next();},
    passport.authenticate('local', { failureRedirect: '/user/sign-in' },), userController.createSession);
router.get('/sign-out', userController.destroySession);
router.get('/getuser',authenticate, userController.getuser);
router.get('/userdetails/:id', userController.userdetails);


module.exports = router;