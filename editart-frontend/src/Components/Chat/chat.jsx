import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../../socket/socket";
import "./chat.css";
import { useRef } from "react";
function Chat() {
  const bottomRef = useRef();
  const { userId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  console.log("URL UserId:", userId);
  console.log("Current User:", currentUser);
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("RECEIVED MESSAGE:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    createConversation();
  }, [userId]);

  const createConversation = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/chat/conversation",
      {
        receiverId: userId,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    setConversationId(response.data._id);

    fetchMessages(response.data._id);
  };

const fetchMessages = async (conversationId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `http://localhost:5000/api/chat/messages/${conversationId}`,
    {
      headers: {
        Authorization: token,
      },
    },
  );

  setMessages(response.data);
};

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    socket.emit("addUser", currentUser._id);
  }, []);

  const sendMessage = () => {
    // console.log("Send Clicked");

    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      conversationId,
      senderId: user._id,
      receiverId: userId,
      text: message,
    };
    // console.log("Sending:", data);
    socket.emit("sendMessage", data);

    setMessages((prev) => [...prev, data]);

    setMessage("");
  };

  return (
    <div className="chat_container">
      <div className="chat_header">
        <div>
          <h2>Creative Chat</h2>
          <p>Connect with artists and creators</p>
        </div>
      </div>

      <div className="chat_messages">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={
              msg.sender === currentUser._id || msg.senderId === currentUser._id
                ? "my_message"
                : "other_message"
            }
          >
            {msg.text}
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      <div className="chat_input">
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
