const Conversation = require("../models/conversation");

const Message = require("../models/message");
exports.createConversation = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const { receiverId } = req.body;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [req.user.id, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, receiverId],
      });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      participants: {
        $all: [req.user.id, req.params.userId],
      },
    });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// exports.getChatHistory = async (req, res) => {
//   try {
//     const currentUser = req.user.id;
//     const otherUser = req.params.userId;

//     const messages = await Message.find({
//       $or: [
//         {
//           sender: currentUser,
//           receiver: otherUser,
//         },
//         {
//           sender: otherUser,
//           receiver: currentUser,
//         },
//       ],
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    const message = await Message.create({
      conversationId,
      sender: req.user.id,
      text,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    })
      .populate("sender", "accountName profilePic")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};