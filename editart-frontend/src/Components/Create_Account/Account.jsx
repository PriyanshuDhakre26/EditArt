import { useState } from "react";
import axios from "axios";
import "./Account.css";
import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    accountName: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
      );

      // alert(response.data.message);

      localStorage.setItem("token", response.data.token);

      setFormData({
        userId: "",
        name: "",
        accountName: "",
        password: "",
      });

      navigate("/userprofile");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login_page">
      <div className="overlay"></div>

      <div className="login_card">
        <div className="logo_section">
          <h1>Create Account</h1>

          <p>Join EditArt and bring your imagination to life</p>
        </div>

        <form onSubmit={handleSubmit} className="login_form">
          <label>User ID</label>

          <input
            type="text"
            name="userId"
            placeholder="Choose a unique user ID"
            value={formData.userId}
            onChange={handleChange}
          />

          <label>Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Account Name</label>

          <input
            type="text"
            name="accountName"
            placeholder="Choose an account name"
            value={formData.accountName}
            onChange={handleChange}
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Create Account</button>
        </form>

        <p className="bottom_text">
          Already have an account?
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Account;
