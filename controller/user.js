const User = require("../model/user.js");

module.exports.signUpPage = (req, res) => {
  res.render("listings/signup.ejs");
};

module.exports.signingUpTheUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userDetails = new User({ username: username, email: email });
    const registeredUser = await User.register(userDetails, password);
    console.log("Password is: ", password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Account have been created");
      res.redirect("/listing");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/user/signup");
  }
};

module.exports.loginForm = (req, res) => {
  res.render("listings/login.ejs");
};

module.exports.loginTheUser = (req, res) => {
  req.flash("success", "You have logged In !!");
  const url = res.locals.url || "/listing";
  res.redirect(url);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logout !!");
    res.redirect("/listing");
  });
};
