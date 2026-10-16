import React, { useEffect, useState } from "react";
import { WiMoonAltWaningCrescent4 } from "react-icons/wi";
import "./style.css";


const Themetoggle = () => {
  const [theme, settheme] = useState(localStorage.getItem("theme"));
  const themetoggle = () => {
    settheme(theme === "dark" ? "light" : "dark");
  };
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme ); 
  }, [theme]);
  return (
    <button
      type="button"
      className="nav_ac theme_toggle_btn"
      onClick={themetoggle}
      aria-label="Toggle light and dark theme"
    >
      <WiMoonAltWaningCrescent4 />
    </button>
  );
};

export default Themetoggle;
