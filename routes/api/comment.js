const express = require('express');
const router = express.Router();
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport');
const commentsController=require('../../controllers/comment_controller')

router.post('/create',passport.checkAuthentication,commentsController.create);
router.get('/delete/:id',passport.checkAuthentication,commentsController.destroy);

module.exports = router;