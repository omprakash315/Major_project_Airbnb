const express = require("express");
const router = express.Router();
const wrapAsync = require("../utelity/wrapAsync.js");
const ExpressError = require("../utelity/ExpressError.js");
const { isLogedIn } = require("../middleware.js");
const controller = require("../controller/listing.js");
const validationschema = require("../schema.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
  let { err } = validationschema.validate(req.body);
  if (err) {
    let errMsg = err.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router
  .route("/")
  .get(wrapAsync(controller.index))
  .post( upload.single("listing[image]") ,validateListing ,controller.create_route);

// new route
router.get("/new", isLogedIn, controller.new_route);

router
  .route("/:id")
  .get(wrapAsync(controller.show_route))
  .put(upload.single("listing[image]"),validateListing, isLogedIn, wrapAsync(controller.update_route))
  .delete(isLogedIn, wrapAsync(controller.delete_route));

// index route
// router.get("/", wrapAsync(controller.index));


// show route
// router.get("/:id", wrapAsync(controller.show_route));

// create route
// router.post("/", validateListing, controller.create_route);

//edit route
router.get("/:id/edit", isLogedIn, wrapAsync(controller.edit_route));

// update route
// router.put(
//   "/:id",
//   validateListing,
//   isLogedIn,
//   wrapAsync(controller.update_route)
// );

//delete route
// router.delete("/:id", isLogedIn, wrapAsync(controller.delete_route));

module.exports = router;
