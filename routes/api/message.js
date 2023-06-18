const express = require('express');
const router = express.Router();
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport');
const messageController=require('../../controllers/message_controller')

router.post('/addMessage',passport.checkAuthentication,messageController.addMessage);
router.post('/getMessages',passport.checkAuthentication,messageController.getMessages);

module.exports = router;