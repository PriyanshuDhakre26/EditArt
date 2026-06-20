const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  accountName: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
});


module.exports = mongoose.models.User || mongoose.model("User", userSchema);
