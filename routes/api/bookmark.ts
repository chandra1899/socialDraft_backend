import express from 'express'
const router = express.Router();
import passport from 'passport'
import {toggleBookmark} from '../../controllers/bookmark_controller'

// const express = require('express');
// const router = express.Router();
// const passport=require('passport')
// const {toggleBookmark}=require('../../controllers/bookmark_controller')

router.post('/',passport.checkAuthentication,toggleBookmark);


module.exports = router;