const Sauce = require("../models/sauces");

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params._id })
    .then((sauce) => {
      let updateLike;
      let messageLike;
      const userId = req.body.userId;
      const like = req.body.like;
      if (!sauce.usersLiked.includes(userId) && like === 1) {
        updateLike = {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        };
        messageLike = "Sauce like à 1";
      }
      if (sauce.usersLiked.includes(userId) && like === 0) {
        updateLike = {
          $inc: { likes: -1 },
          $pull: { usersLiked: userId },
        };
        messageLike = "Sauce like à 0";
      }
      if (!sauce.usersDisliked.includes(userId) && like === -1) {
        updateLike = {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
        };
        messageLike = "Sauce dislike à 1";
      }
      if (sauce.usersDisliked.includes(userId) && like === 0) {
        updateLike = {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: userId },
        };
        messageLike = "Sauce dislike à 0";
      }
      Sauce.updateOne({ _id: req.params._id }, updateLike)
        .then(() => res.status(201).json({ message: messageLike }))
        .catch((error) => res.status(400).json({ error }));
    })

    .catch((error) => res.status(404).json({ error }));
};
