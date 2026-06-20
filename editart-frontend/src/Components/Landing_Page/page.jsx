import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import landing_page_bg_img from "../../assets/images/landing_page_bg_img.png";
import landing_page_floating_feather from "../../assets/images/landing_page_floating_feather.png";
import landing_page_logo from "../../assets/images/landing_page_logo.png";
import "./page.css";

function LandingPage() {
  const navigate = useNavigate();

  // const [showFeather, setShowFeather] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // const feather = setTimeout(() => {
    //   setShowFeather(true);
    // }, 2000);

    const logo = setTimeout(() => {
      setShowLogo(true);
    }, 1000);

    const content = setTimeout(() => {
      setShowContent(true);
    }, 4000);

    return () => {
      // clearTimeout(feather);
      clearTimeout(logo);
      clearTimeout(content);
    };
  }, []);

  return (
    <div className="landing">
      {/* Night Background */}
      <img src={landing_page_bg_img} alt="" className="night_bg" />

      {/* Moon Glow */}
      <div className="moon_glow"></div>

      {/* Feather */}
      {/* {showFeather && (
        <img
          src={landing_page_floating_feather}
          alt=""
          className={`feather ${showLogo ? "fade_feather" : ""}`}
        />
      )} */}

      {/* Logo */}
      {showLogo && <img src={landing_page_logo} alt="" className="logo" />}

      {/* Final Content */}
      {showContent && (
        <div className="hero_content">
          <h1>EditArt</h1>

          <p>Share Creativity. Inspire The World.</p>

          <button onClick={() => navigate("/login")}>Get Started</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
