const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oidc");
const FacebookStrategy = require("passport-facebook");
const AuthService = require("../../application/AuthService");

const router = express.Router();
const { FE_URL } = process.env;

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: `${FE_URL}/login`,
  })
);

router.post("/signup", async function (req, res, next) {
  try {
    const { username, password, email } = req.body;
    const userOrErr = await AuthService.signUp(username, password, email);
    if (!userOrErr?.id_user) return next(userOrErr);
    req.login(userOrErr, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: `${FE_URL}/login`,
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
    failureRedirect: `${FE_URL}/login`,
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${FE_URL}/login`);
  });
});

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    try {
      const result = await AuthService.handlePasswordVerification(
        username,
        password
      );
      if (!result) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      }
      return cb(null, result);
    } catch (err) {
      return cb(err);
    }
  })
);

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
        const result = await AuthService.handleOAuthVerification(
          issuer,
          profile
        );
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
        const result = await AuthService.handleOAuthVerification(
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
    cb(null, { id: user.id_user, username: user.username, email: user.email });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

module.exports = router;
