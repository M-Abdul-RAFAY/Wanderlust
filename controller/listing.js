const Listing = require("../model/listing");

module.exports.index = async (req, res) => {
  let result = await Listing.find();
  res.render("./listings/index.ejs", { result });
};

module.exports.createListing = (req, res) => {
  res.render("./listings/create.ejs");
};

module.exports.createdListingPushToDb = async (req, res, next) => {
  let { path, filename } = req.file;
  const instanceOfNewListing = new Listing(req.body.listing);
  instanceOfNewListing.image = { url: path, filename };
  instanceOfNewListing.owner = req.user._id;
  await instanceOfNewListing.save();
  req.flash("success", "New Listing has been added");
  res.redirect("/listing");
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const result = await Listing.findById(id);
  if (!result) {
    req.flash("error", "You cannot edit this page");
    return res.redirect("/listing");
  }
  res.render("listings/edit.ejs", { result });
};

module.exports.patchingTheEditing = async (req, res) => {
  const { id } = req.params;
  if (!req.body.listing) {
    throw new ExpressError(500, "Please fill all the fields");
  }
  const listing = req.body.listing;
  await Listing.findByIdAndUpdate(id, listing);
  req.flash("success", "Listing has been updated");
  res.redirect("/listing");
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing have been deleted");
  res.redirect("/listing");
};

module.exports.cards = async (req, res) => {
  const { id } = req.params;
  const result = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");

  if (!result) {
    req.flash("error", "Listing does not exist");
    return res.redirect("/listing");
  }

  res.render("listings/show.ejs", { result });
};
