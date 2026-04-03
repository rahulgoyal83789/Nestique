const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateListing,isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage, cloudinary} = require("../cloudConfig.js")
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn("create a listing") ,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

// New Route
router.get("/new", isLoggedIn("create a listing") ,listingController.renderNewForm);

// 👇 Add this search suggestions route here (MUST be before /:id)
router.get("/search-suggestions", wrapAsync(listingController.searchSuggestions));

router.
  route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn("update a listing"), isOwner("update") ,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn("delete a listing"), isOwner("delete") ,wrapAsync(listingController.destroyListing));

// Edit route
router.get("/:id/edit", isLoggedIn("edit a listing"), isOwner("edit") ,wrapAsync(listingController.renderEditForm));

module.exports = router;