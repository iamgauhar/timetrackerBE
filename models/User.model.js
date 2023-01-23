const mongoose = require("mongoose");

const UserModel = mongoose.model(
  "user",
  mongoose.Schema({
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      default: "",
    },
  })
);

module.exports = { UserModel };
