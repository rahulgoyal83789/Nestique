const Listing = require("../models/listing.js");
const maptilerClient = require('@maptiler/client');
const { cloudinary } = require("../cloudConfig.js"); 
const mapToken = process.env.MAP_TOKEN;
maptilerClient.config.apiKey = mapToken;

module.exports.index = async (req, res) => {
    const { category, search, minPrice, maxPrice } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
        const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query = {
            $or: [
                { title: { $regex: sanitizedSearch, $options: "i" } },
                { location: { $regex: sanitizedSearch, $options: "i" } },
                { country: { $regex: sanitizedSearch, $options: "i" } },
            ]
        };
    } else if (category) {
        query = { category: category };
    }

    // ✅ Price range filter — validate parseInt to guard against NaN from bad input
    const parsedMin = parseInt(minPrice);
    const parsedMax = parseInt(maxPrice);
    if (!isNaN(parsedMin) || !isNaN(parsedMax)) {
        query.price = {};
        if (!isNaN(parsedMin) && parsedMin >= 0) query.price.$gte = parsedMin;
        if (!isNaN(parsedMax) && parsedMax >= 0) query.price.$lte = parsedMax;
    }

    const totalListings = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalListings / limit);
    const allListings = await Listing.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    res.render("listings/index.ejs", { 
        allListings, 
        currCategory: category,
        currentPage: page,
        totalPages,
        totalListings,
        limit,
        searchQuery: search || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || ''
    });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await maptilerClient.geocoding.forward(
        req.body.listing.location,
        { limit: 1 }
    );
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.owner = req.user._id;
    newListing.geometry = response.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exists!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    const existingLocation = listing.location;
    if (req.body.listing.location !== existingLocation) {
        let response = await maptilerClient.geocoding.forward(
            req.body.listing.location,
            { limit: 1 }
        );
        listing.geometry = response.features[0].geometry;
    }

    listing.category = req.body.listing.category;

    if (typeof req.file !== "undefined") {
        // ✅ Delete old image from Cloudinary before uploading new one
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    // ✅ Delete image from Cloudinary after listing is deleted
    if (deletedListing && deletedListing.image && deletedListing.image.filename) {
        await cloudinary.uploader.destroy(deletedListing.image.filename);
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchSuggestions = async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim() === '') return res.json([]);
    const sanitizedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const listings = await Listing.find({
        $or: [
            { title: { $regex: sanitizedQuery, $options: "i" } },
            { location: { $regex: sanitizedQuery, $options: "i" } },
            { country: { $regex: sanitizedQuery, $options: "i" } },
        ]
    }).limit(5);

    const suggestions = listings.map(l => ({
        title: l.title,
        location: l.location,
        id: l._id
    }));

    res.json(suggestions);
};