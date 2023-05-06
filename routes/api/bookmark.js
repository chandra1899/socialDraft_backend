const express = require('express');
const router = express.Router();
const passport=require('passport');
const bookmarkController=require('../../controllers/bookmark_controller')

router.post('/',passport.checkAuthenticatoion,bookmarkController.toggleBookmark);


module.exports = router;