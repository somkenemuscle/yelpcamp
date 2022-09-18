const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require("../schemas")
const {reviewSchema} = require("../schemas.js")
const Review = require("../models/review")





module.exports.isLoggedin = function (req, res, next) {
   if (!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl
      req.flash('error', "you need to be logged in")
      return res.redirect('/login')
   }
   next();
}

//joi middlewares mongoose
module.exports.validateCampground = (req, res, next) => {
   const { error } = campgroundSchema.validate(req.body)
   if (error) throw new ExpressError(error.message, 404)
   else {
       next()
   }
}

module.exports.isUser = async(req, res, next) => {
   const {id} = req.params
   const campground = await Campground.findById(id)
   if (!campground.author.equals(req.user._id)) {
       req.flash('error', "you dont have permission to do that")
       return res.redirect('/campgrounds/' + campground.id)
   }
   next()
}

module.exports.isReview = async(req, res, next) => {
   const {reviewId, id} = req.params
   const review = await Review.findById(reviewId)
   if (!review.author.equals(req.user._id)) {
       req.flash('error', "you dont have permission to do that")
       return res.redirect('/campgrounds/' + id)
   }
   next()
}
module.exports.validateReview = (req,res,next) => {
   const {error} = reviewSchema.validate(req.body)
   if (error) throw new ExpressError(error.message, 404)
   else{
       next()
   }
}

