if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouters = require("./routes/listing");
const reviewRouters = require("./routes/review");
const userRouters = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/user.js");

app.set("view cache", false);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionOption = {
  secret: "RafayKing",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  next();
});

app.use("/listing", listingRouters);
app.use("/listings/:id/review", reviewRouters);
app.use("/user", userRouters);

async function main() {
  await mongoose.connect(process.env.MONGODB);
}

main()
  .then(() => {
    console.log("connected to the mongodb server");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.redirect("/listing");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "This page does not exist"));
});

app.use((err, req, res, next) => {
  console.log(req.url);
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
  next(err);
});

app.listen("3000", () => {
  console.log("The server is up and running");
});
