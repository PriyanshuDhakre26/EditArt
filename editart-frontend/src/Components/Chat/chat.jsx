import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import socket from "../../socket/socket";
import API_URL from "../../config/api";
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
    console.log("useEffect createConversation fired");
    createConversation();
  }, [userId]);
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



 const createConversation = async () => {
   try {
     console.log("CREATE CONVERSATION START");

     const token = localStorage.getItem("token");
     console.log("TOKEN:", token);

     console.log("USER ID:", userId);

     const response = await axios.post(
       `${API_URL}/api/chat/conversation`,
       {
         receiverId: userId,
       },
       {
         headers: {
           Authorization: token,
         },
       },
     );

     console.log("CONVERSATION RESPONSE:", response.data);

     setConversationId(response.data._id);

     fetchMessages(response.data._id);
   } catch (error) {
     console.log("CREATE CONVERSATION ERROR:");
     console.log(error);
     console.log(error.response?.data);
   }
 };

const fetchMessages = async (conversationId) => {
  if (!conversationId) return;

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/api/chat/messages/${conversationId}`,
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
    if (!conversationId) {
      console.log("Conversation not created yet");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      conversationId,
      senderId: user._id,
      receiverId: userId,
      text: message,
    };

    console.log("Sending:", data);

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
