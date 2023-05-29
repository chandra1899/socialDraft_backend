const express = require('express');
const router = express.Router();
// const Authenticate=require('../../middlewares/auth')
const passport=require('passport');
const commentsController=require('../../controllers/comment_controller')

router.post('/create',passport.checkAuthentication,commentsController.create);
router.get('/destroy/:id',commentsController.destroy);

module.exports = router;