const User = require("../models/user");
const Post = require("../models/post");

console.log("searchcontroller.js loaded");

const searchUsers = async (query) => {
  return await User.find({
    $or: [
      {
        accountName: {
          $regex: query,
          $options: "i",
        },
      },
      {
        name: {
          $regex: query,
          $options: "i",
        },
      },
    ],
  });
};

const searchPosts = async (query) => {
  return await Post.find({
    caption: {
      $regex: query,
      $options: "i",
    },
  });
};

module.exports = {
  searchUsers,
  searchPosts,
};
