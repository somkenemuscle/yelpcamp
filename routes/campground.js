const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedin, validateCampground, isUser } = require('../middleware/isLogged')
const campgrounds = require('../controllers/campgrounds')
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage})



router.route('/')
    .get(campgrounds.index)
    .post(isLoggedin, upload.array('image'),validateCampground, catchAsync(campgrounds.postNewCampground))
    

router.get('/new', isLoggedin, campgrounds.showNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCamp))
    .patch(isLoggedin, isUser,  upload.array('image'),validateCampground,catchAsync(campgrounds.postEditedData))
    .delete(isLoggedin, isUser, catchAsync(campgrounds.deleteCamp))

router.get('/:id/edit', isLoggedin, isUser, catchAsync(campgrounds.GetEditForm))

module.exports = router;