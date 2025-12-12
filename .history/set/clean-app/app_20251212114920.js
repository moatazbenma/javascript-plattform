var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var authRoutes = require("./routes/auth");
var userRoutes = require("./routes/userRoutes");
var articleRoutes = require("./routes/articleRoutes");

var app = express();

// Sessions
const session = require("express-session");
app.use(
  session({
    secret: "supersecret123",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/articles", articleRoutes);


// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/", indexRouter);        // Home
app.use("/auth", authRoutes);     // Login / Logout / Register
app.use("/users", userRoutes);    // User CRUD

// 404 Error
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
