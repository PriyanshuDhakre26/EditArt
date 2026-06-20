const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");
const createPost = async (req, res) => {
  
  try {
    
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });
    

    const post = await Post.create({
      user: req.user.id,
      caption: req.body.caption,
      mediaUrl: result.secure_url,
      type: result.resource_type,
    });

    res.status(201).json(post);
  } catch (error) {
    console.log("POST ERROR:");
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createPost,
  getMyPosts,
  deletePost,
};
