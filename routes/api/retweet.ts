import express from 'express'
const router = express.Router();
import passport from 'passport'
import {toggleRetweet} from '../../controllers/retweet_controller'

// const express = require('express');
// const router = express.Router();
// const passport=require('passport')
// const {toggleRetweet}=require('../../controllers/retweet_controller')

router.post('/',passport.checkAuthentication,toggleRetweet);

module.exports = router;