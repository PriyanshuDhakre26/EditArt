const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
console.log("Requested User:", req.params.id);
    const posts = await Post.find({
      user: req.params.id,
    });

    res.json({
      success: true,
      user,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
