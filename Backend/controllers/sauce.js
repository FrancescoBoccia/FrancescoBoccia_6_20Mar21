const Sauce = require("../models/Sauce");
const fs = require("fs");
const app = require("../app");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const url = req.protocol + "://" + req.get("host");
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: url + "/images/" + req.file.filename,
  });
  sauce
    .save()
    .then(() => res.status(200).json({ message: " Sauce created !" }))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error: error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce Modified !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Deleted!" }))
        .catch((error) => res.status(400).json({ error: error }));
    });
  });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error: error }));
};

exports.likeOrDislikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    sauce.likeOrDislike( req.body.like, req.body.userId);
    sauce
      .save()
      .then(() => res.status(200).json({ message: "Like Submitted!" }))
      .catch((error) => res.status(400).json({ error: error }));
  });
};
