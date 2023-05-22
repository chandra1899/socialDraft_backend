const express = require('express');
const router = express.Router();
const Authenticate=require('../../middlewares/auth')
const commentsController=require('../../controllers/comment_controller')

router.post('/create',Authenticate,commentsController.create);
router.get('/destroy/:id',commentsController.destroy);

module.exports = router;