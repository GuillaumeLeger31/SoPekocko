const Sauces = require("../models/sauces");
const fs = require("fs");

exports.addSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauces({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: "0",
    dislikes: "0",
    usersLiked: [""],
    usersDisliked: [""],
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({
        message: "Sauce enregistré !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({
        error,
      })
    );
};

exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauces.updateOne(
    {
      _id: req.params.id,
    },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() =>
      res.status(200).json({
        message: "Objet modifié !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id,
  })
  .then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
      Sauces.deleteOne({
        _id: req.params.id,
      })
        .then(() => { 
          fs.unlink(`images/${filename}`, () => {
          });
          res.status(200).json({
            message: "Objet supprimé !",
          })
        }
        )
        .catch((error) =>
          res.status(400).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

exports.likeSauce = (req, res, next) => {

  Sauces.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      if (req.body.like == 1) {
        sauce.usersLiked.push(req.body.userId);
        sauce.likes++;
      } else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes++;
      } else if (req.body.like == 0 && sauce.usersLiked.includes(req.body.userId)) {
        sauce.likes--;
        let position = sauce.usersLiked.indexOf(req.body.userId);
        sauce.usersLiked.splice(position, 1);
      } else if (req.body.like == 0 && sauce.usersDisliked.includes(req.body.userId)) {
        sauce.dislikes--;
        let position = sauce.usersDisliked.indexOf(req.body.userId);
        sauce.usersDisliked.splice(position, 1);
      }
      Sauces.updateOne(
        {
          _id: req.params.id,
        },
        {
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
          dislikes: sauce.dislikes,
          likes: sauce.likes,
          _id: req.params.id,
        }
      )
        .then(() =>
          res.status(200).json({
            message: "Sauce modifiée !",
          })
        )
        .catch((error) =>
          res.status(400).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};
  