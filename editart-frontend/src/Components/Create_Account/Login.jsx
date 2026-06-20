import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import landing_page_logo from "../../assets/images/landing_page_logo.png";
import "./Account.css";

function Login() {
  const [formData, setFormData] = useState({
    accountName: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", formData);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      // alert("Login Successful");

      console.log(response.data);

      // Later:
      navigate("/search");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login_page">
      <div className="overlay"></div>

      <div className="login_card">
        <div className="logo_section">
          {/* <img src={landing_page_logo} alt="logo" className="logo" /> */}

          <h1>Welcome Back</h1>

          <p>Login to continue your creative journey</p>
        </div>

        <form onSubmit={handleSubmit} className="login_form">
          <label>Account Name</label>

          <input
            type="text"
            name="accountName"
            placeholder="Enter your account name"
            value={formData.accountName}
            onChange={handleChange}
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* <div className="forgot">Forgot Password?</div> */}

          <button type="submit">Login</button>
        </form>

        {/* <div className="divider">
         <span>or continue with</span>
       </div> */}

        {/* <div className="social_icons">
         <div>G</div>
         <div>f</div>
         <div></div>
       </div> */}

        <p className="bottom_text">
          Don't have an account?
          <span onClick={() => navigate("/register")}>Create Account</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
