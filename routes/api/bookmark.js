const express = require('express');
const router = express.Router();
const Authenticate=require('../../middlewares/auth')
const bookmarkController=require('../../controllers/bookmark_controller')

router.post('/',Authenticate,bookmarkController.toggleBookmark);


module.exports = router;