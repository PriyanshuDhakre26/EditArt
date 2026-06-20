import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import LandingPage from "./Components/Landing_Page/page";
import Account from "./Components/Create_Account/Account";
import Login from "./Components/Create_Account/Login";
import Search from "./Components/Searching_Page/search";
import ImageDetails from "./Components/Searching_Page/ImageDetails";
import UserProfile from "./Components/UserProfile/userprofile";
import UserProfileView from "./Components/UserProfile/userprofileview";
import Chat from "./Components/Chat/chat";
import socket from "./socket/socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      const user = JSON.parse(localStorage.getItem("user"));

      if (user?._id) {
        socket.emit("addUser", user._id);

        console.log("User Added:", user._id);
      }
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/image/:id" element={<ImageDetails />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/user/:id" element={<UserProfileView />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:userId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
