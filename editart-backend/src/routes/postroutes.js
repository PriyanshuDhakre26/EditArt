const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");


const auth = require("../middlewares/authmiddleware");

const {
  createPost,
  getMyPosts,
  deletePost,
} = require("../controllers/postcontrollers");



router.get("/", auth, getMyPosts);

router.delete("/:id", auth, deletePost);
router.post("/", auth, upload.single("file"), createPost);
router.get("/test", (req, res) => {
  res.send("Post route working");
});

module.exports = router;
