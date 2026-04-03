const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//POST route for reviews
router.post("/",isLoggedIn("create a review"),validateReview,wrapAsync(reviewController.createReview));

//DELETE ROUTE for review
router.delete("/:reviewId",isLoggedIn("delete a review"),isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
