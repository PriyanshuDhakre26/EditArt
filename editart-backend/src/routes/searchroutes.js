const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { searchUsers, searchPosts } = require("../controllers/searchcontroller");

router.get("/", async (req, res) => {
  try {
    const query = req.query.q;

    const users = await searchUsers(query);

    const userIds = users.map((user) => user._id);

    const posts = await Post.find({
      $or: [
        {
          caption: {
            $regex: query,
            $options: "i",
          },
        },
        {
          user: {
            $in: userIds,
          },
        },
      ],
    }).populate("user", "accountName name");

    res.json({
      users,
      posts,
    });
  } catch (error) {
    console.log("SEARCH ERROR:");
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
