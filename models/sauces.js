const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  userId: String,
  name: String,
  manufacturer: String,
  description: String,
  imageUrl: String,
  heat: Number,
  mainPepper: String,

  usersLiked: [String],
  usersDisliked: [String],
  likes: Number,
  dislikes: Number,
});

module.exports = mongoose.model("sauces", sauceSchema);
