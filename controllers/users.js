require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const factor = 10;

exports.signup = (req, res, next) => {
  const passwordUser = req.body.password;
  const emailUser = req.body.email;
  const formatMail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
  const formatPassword = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{8,}$/;
  if (!formatMail.test(emailUser)) {
    res.status(400).json({ message: "format d'adresse mail incorrect" });
  } else {
    if (formatPassword.test(passwordUser) == true) {
      bcrypt
        .hash(passwordUser, factor)
        .then((hash) => {
          const user = new User({
            email: emailUser,
            password: hash,
          });
          user
            .save()
            .then(() => res.status(201).json({ message: "utilisateur créé" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    } else {
      res.status(400).json({
        message:
          "Mot de passe doit comporter 1 Majuscule - 1 minuscule - 1 chiffre - 8 caractères",
      });
    }
  }
};

exports.login = (req, res, next) => {
  const passwordUser = req.body.password;
  const emailUser = req.body.email;
  User.findOne({ email: emailUser })
    .then((user) => {
      if (!user) {
        res
          .status(401)
          .json({ message: "indentifiants/Mot de passe incorrect" });
      }
      bcrypt
        .compare(passwordUser, user.password)
        .then((valid) => {
          if (!valid) {
            res.status(401).json({
              message: "indentifiant/Mot de passes incorrect",
            });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${process.env.secretKey}`, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
