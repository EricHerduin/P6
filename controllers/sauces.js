const Sauce = require("../models/sauces");
require("express");
const fs = require("fs");
const decode = require("../general");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject.userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    name: decode.htmlspecialchars(sauceObject.name.trim()),
    manufacturer: decode.htmlspecialchars(sauceObject.manufacturer.trim()),
    mainPepper: decode.htmlspecialchars(sauceObject.mainPepper.trim()),
    description: decode.htmlspecialchars(sauceObject.description.trim()),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params._id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "modification non autorisée" });
      } else {
        // const sauceObject = JSON.parse(req.body.sauce);
        const sauceObject = req.body;
        const sauceObjectUpdate = req.file
          ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            }
          : {
              ...sauceObject,
              name: decode.htmlspecialchars(sauceObject.name.trim()),
              manufacturer: decode.htmlspecialchars(
                sauceObject.manufacturer.trim()
              ),
              mainPepper: decode.htmlspecialchars(
                sauceObject.mainPepper.trim()
              ),
              description: decode.htmlspecialchars(
                sauceObject.description.trim()
              ),
            };

        delete sauceObjectUpdate.userId;

        Sauce.updateOne(
          { _id: req.params._id },
          { ...sauceObjectUpdate, _id: req.params._id }
        )
          .then(() => res.status(201).json({ message: "objet modifié" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params._id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Suppression non autorisée" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          sauce
            .deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params._id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ message: "produit non trouvé" });
      } else {
        sauce = {
          ...sauce._doc,
          name: decode.htmlspecialchars_decode(sauce.name),
          description: decode.htmlspecialchars_decode(sauce.description),
          mainPepper: decode.htmlspecialchars_decode(sauce.mainPepper),
          manufacturer: decode.htmlspecialchars_decode(sauce.manufacturer),
        };

        res.status(200).json(sauce);
      }
    })

    .catch((error) => res.status(401).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      let getSauces = [];
      for (i = 0; i < sauces.length; i++) {
        const getSauce = {
          ...sauces[i]._doc,
          name: decode.htmlspecialchars_decode(sauces[i].name),
          description: decode.htmlspecialchars_decode(sauces[i].description),
          mainPepper: decode.htmlspecialchars_decode(sauces[i].mainPepper),
          manufacturer: decode.htmlspecialchars_decode(sauces[i].manufacturer),
        };
        getSauces.push(getSauce);
      }

      res.status(200).json(getSauces);
    })
    .catch((error) => res.status(500).json({ error }));
};
