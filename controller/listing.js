// require
const Listing = require("../model/listening.js");
const validationschema = require("../schema.js");
const ExpressError = require("../utelity/ExpressError.js");



module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
};

module.exports.new_route = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.show_route = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exit!");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.create_route = async (req, res, next) => {
  let url =req.file.path;
  let filename=req.file.filename;
  let result = validationschema.validate(req.body);
  const newListing = new Listing(req.body.listing);
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.edit_route = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exit!");
    res.redirect("/listings");
  }
  res.render("listing/edit.ejs", { listing });
};

module.exports.update_route = async (req, res, next) => {
  
  let { id } = req.params;
  let New_listingsawait= Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file!="undefined"){
    let url =req.file.path;
    let filename=req.file.filename;
    New_listingsawait.image={url,filename};
  }
  req.flash("success", " Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.delete_route = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "List Deleted");
  res.redirect("/listings");
};
