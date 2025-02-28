const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

router
  .route("/signup")
  .get(userController.signUpPage)
  .post(wrapAsync(userController.signingUpTheUser));

router
  .route("/login")
  .get(userController.loginForm)
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    userController.loginTheUser
  );

router.get("/logout", userController.logout);

module.exports = router;
