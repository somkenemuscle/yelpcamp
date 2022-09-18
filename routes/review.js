const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const Review = require("../models/review")
const Campground = require('../models/campground');
const {validateReview, isLoggedin, isReview} = require('../middleware/isLogged')
const reviews = require('../controllers/reviews')











//*************** */
//review routes
//*************** */
router.post('/',isLoggedin,validateReview,reviews.postReview );

router.delete('/:reviewId',isLoggedin,isReview, catchAsync(reviews.deleteReview))

module.exports = router;