const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authroutes");
const postRoutes = require("./routes/postroutes");
const searchRoutes = require("./routes/searchroutes");
const userRoutes = require("./routes/userroutes");
const chatRoutes = require("./routes/chatroutes");


// console.log("Search Routes Loaded");
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("App is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);
module.exports = app;
