const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oidc");
const FacebookStrategy = require("passport-facebook");
const AuthService = require("../../application/AuthService");

const router = express.Router();

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get(
  "/login/federated/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    async function verify(issuer, profile, cb) {
      try {
        const result = await AuthService.handleVerification(issuer, profile);
        return cb(null, result);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env["FACEBOOK_CLIENT_ID"],
      clientSecret: process.env["FACEBOOK_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/facebook",
      state: true,
      profileFields: ["email", "displayName"],
    },
    async function verify(accessToken, refreshToken, profile, cb) {
      try {
        const result = await AuthService.handleVerification(
          profile.provider,
          profile
        );
        return cb(null, result);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

module.exports = router;
