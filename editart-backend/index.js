const dotenv = require("dotenv");
const Message = require("./src/models/Message");
dotenv.config();
const {
  addUser,
  removeUser,
  getUser,
  onlineUsers,
} = require("./src/socket/socket");
const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    console.log("User Added:", userId);
  });

socket.on("sendMessage", async (data) => {
  try {
    console.log("MESSAGE:", data);

   await Message.create({
     conversationId: data.conversationId,
     sender: data.senderId,
     text: data.text,
   });

    console.log("Message Saved");

    const receiver = getUser(data.receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", data);

      console.log("MESSAGE DELIVERED");
    }
  } catch (error) {
    console.log(error);
  }
});

  socket.on("disconnect", () => {
    removeUser(socket.id);

    console.log("User Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
