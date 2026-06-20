let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userIndex = onlineUsers.findIndex((user) => user.userId === userId);

  if (userIndex !== -1) {
    onlineUsers[userIndex].socketId = socketId;
  } else {
    onlineUsers.push({
      userId,
      socketId,
    });
  }

  console.log("ONLINE USERS:", onlineUsers);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);

  console.log("ONLINE USERS:", onlineUsers);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
};
