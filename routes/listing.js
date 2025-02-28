const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogin, isUser, validate } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });

router.get("/", wrapAsync(listingController.index));

router
  .route("/create")
  .get(isLogin, listingController.createListing)
  .post(
    upload.single("listing[image]"),
    validate,
    wrapAsync(listingController.createdListingPushToDb)
  );

router
  .route("/:id/edit")
  .get(isLogin, isUser, wrapAsync(listingController.edit))
  .patch(isUser, wrapAsync(listingController.patchingTheEditing));

router
  .delete("/delete/:id", isLogin, isUser, wrapAsync(listingController.destroy))
  .get("/:id", listingController.cards);

module.exports = router;
