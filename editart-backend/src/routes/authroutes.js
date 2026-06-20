const express = require("express");
const upload = require("../middlewares/upload");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  uploadProfilePicture,
  updateProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("image"),
  uploadProfilePicture,
);
router.put("/profile", authMiddleware, updateProfile);

console.log("Auth Routes Loaded");
module.exports = router;
