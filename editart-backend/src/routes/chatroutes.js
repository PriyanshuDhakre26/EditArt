const express = require("express");

const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const {
  createConversation,
  sendMessage,
  getMessages,
  getChatHistory,
  getConversation,
} = require("../controllers/chatController");

router.post("/conversation", auth, createConversation);

router.post("/message", auth, sendMessage);

router.get("/messages/:id", auth, getMessages);
router.get("/conversation/:userId", auth, getConversation);
// router.get("/history/:userId", auth, getChatHistory);
module.exports = router;
