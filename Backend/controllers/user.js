const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

const User = require("../models/User");

exports.signup = (req, res, next) => {
  // Minimum 8 characters
  const strongRegex = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
  );
  const password = req.body.password;
  const cryptedEmail = cryptojs
    .SHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY)
    .toString();

  if (password.match(strongRegex)) {
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        const user = new User({
          email: cryptedEmail,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "User created !" }))
          .catch((error) => res.status(400).json({ error: error }));
      })
      .catch((error) => res.status(500).json({ error: error }));
  } else {
    throw new Error("The password is not secure enough, minimum 8 characters! ( a-z, A-Z, 0-9, @$!%*?& )");
  }
};

exports.login = (req, res, next) => {
  const cryptedEmail = cryptojs
    .SHA256(req.body.email, process.env.EMAIL_ENCRYPTION_KEY)
    .toString();

  User.findOne({ email: cryptedEmail })
  .then((user) => {
    if (!user) {
      return res.status(401).json({ error: "User not found !" });
    }
    bcrypt
    .compare(req.body.password, user.password)
    .then((valid) => {
      if (!valid) {
        return res.status(401).json({ error: "Password incorrect !" });
      }
      const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
        expiresIn: "24h"});
      res.status(200).json({
          userId: user._id,
          token: token
        })
        .catch((error) => res.status(500).json({ error: error }));
    })
    .catch((error) => res.status(500).json({ error: error }));
  });
};
