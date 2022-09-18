const express = require('express');
const Passport = require('passport');
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const users = require('../controllers/users')


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.postUdata))

router.route('/login')
    .get(users.renderLogin)
    .post(Passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), users.LoginUser)

router.get('/logout', users.LogOut);

module.exports = router;
