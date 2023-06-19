const express = require('express');
const router = express.Router();
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport')
const retweetController=require('../../controllers/retweet_controller')

router.post('/',passport.checkAuthentication,retweetController.toggleRetweet);


module.exports = router;