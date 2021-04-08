const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: Array, default: [] },
  usersDisliked: { type: Array, default: [] },
});

sauceSchema.methods.likeOrDislike = function (like, user) {
  const wantsToLike = !this.alreadyLiked(user) && like === 1;
  const wantsToDislike = !this.alreadyDisliked(user) && like === -1;
  const wantsToUnvote = like === 0;

  if (wantsToLike) this.receiveLike(user);
  else if (wantsToDislike) this.receiveDislike(user);
  else if (wantsToUnvote) this.resetLikes(user);
};

sauceSchema.methods.alreadyLiked = function (id) {
  return this.usersLiked.find((userId) => userId === (id));
};

sauceSchema.methods.alreadyDisliked = function (id) {
  return this.usersDisliked.find((userId) => userId === (id));
}

sauceSchema.methods.receiveLike = function (user) {
  this.likes += 1;
  this.usersLiked.push(user);
};

sauceSchema.methods.receiveDislike = function (user) {
  this.dislikes += 1;
  this.usersDisliked.push(user);
};

sauceSchema.methods.resetLikes = function (user) {
  if (this.alreadyLiked(user)) {
    this.removeLike(user);
  } else if (this.alreadyDisliked(user)) {
    this.removeDislike(user);
  }
};

sauceSchema.methods.removeLike = function (user) {
  this.likes -= 1;
  this.usersLiked = this.usersLiked.filter((userId) => !userId === (user));
};

sauceSchema.methods.removeDislike = function (user) {
  this.dislikes -= 1;
  this.usersDisliked = this.usersDisliked.filter(
    (userId) => !userId === (user)
  );
};

module.exports = mongoose.model("Sauce", sauceSchema);
