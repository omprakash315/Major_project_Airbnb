const user = require("../model/user.js");

module.exports.signup_index = async (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signup_post = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new user({ email, username });
    const registeredUser = await user.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!! ");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login_index = async (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login_post = async (req, res) => {
  try {
    let Redirect=res.locals.redirect || "/listings";

    res.redirect(Redirect);
  } catch (e) {
    res.redirect("/login");
  }
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "you are Logout successfully!!");
      res.redirect("/listings");
    }
  });
};
