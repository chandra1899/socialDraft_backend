const express = require('express');
const router = express.Router();
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport')
const bookmarkController=require('../../controllers/bookmark_controller')

router.post('/',passport.checkAuthentication,bookmarkController.toggleBookmark);


module.exports = router;