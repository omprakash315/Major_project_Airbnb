const express = require("express");
const router = express.Router();
const wrapAsync = require("../utelity/wrapAsync.js");
const ExpressError = require("../utelity/ExpressError.js");
const validationschema = require("../schema.js");
const passport = require("passport");
const controllerUser = require("../controller/user.js");
const {saveUrl}=require("../middleware.js");
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
  .route("/signup")
  .get(validateListing, wrapAsync(controllerUser.signup_index))
  .post(controllerUser.signup_post);

router
  .route("/login")
  .get(validateListing, wrapAsync(controllerUser.login_index))
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    controllerUser.login_post
  );

// 1.) signup
// index route
// router.get(
//   "/signup",
//   validateListing,
//   wrapAsync(controllerUser.signup_index)
// );

// post
// router.post("/signup",controllerUser.signup_post);

// 2.) login

// router.get("/login", validateListing, wrapAsync(controllerUser.login_index));

// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   controllerUser.login_post
// );

// 3.)logout
router.get("/logout", controllerUser.logout);

module.exports = router;
