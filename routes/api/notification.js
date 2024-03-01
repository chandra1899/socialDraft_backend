const express = require('express');
const router = express.Router();
const passport=require('passport');
const {getnotifications}=require('../../controllers/notifications_controller')

router.get('/getnotifications',passport.checkAuthentication,getnotifications);
// router.post('/getMessages',passport.checkAuthentication,getMessages);

module.exports = router;