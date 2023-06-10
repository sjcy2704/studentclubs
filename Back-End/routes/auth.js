var express = require("express");
var router = express.Router();

var passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "https://heroic-begonia-887362.netlify.app",
  })
);

module.exports = router;
