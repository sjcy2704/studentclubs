var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var passport = require("passport");
var initPassport = require("./passport-config");
var cors = require("cors");
require("dotenv").config();

var mysql = require("mysql");

var dbConnectionPool = mysql.createPool({
  host: "localhost",
  database: "studentclubs",
});

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var clubsRouter = require("./routes/clubs");
var membersRouter = require("./routes/members");
var authRouter = require("./routes/auth");
var eventsRouter = require("./routes/events");
var newsRouter = require("./routes/news");
var rsvpRouter = require("./routes/rsvp");

var app = express();

app.use(function (req, res, next) {
  initPassport(passport, dbConnectionPool, res);
  next();
});

app.use(function (req, res, next) {
  req.pool = dbConnectionPool;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "7b7df068e90fc19b966f23d67ca7a2dc38b977ef78bfb4050b36069a90c9f35a",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/clubs", clubsRouter);
app.use("/members", membersRouter);
app.use("/auth", authRouter);
app.use("/events", eventsRouter);
app.use("/news", newsRouter);
app.use("/rsvp", rsvpRouter);

module.exports = app;
