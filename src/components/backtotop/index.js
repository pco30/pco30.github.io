import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";
import "./style.css";

const HIDDEN_PATHS = ["/", "/contact"];

export const BackToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  const isHiddenPage = HIDDEN_PATHS.includes(pathname);

  useEffect(() => {
    if (isHiddenPage) {
      setVisible(false);
      return undefined;
    }

    const onScroll = () => {
      setVisible(window.scrollY > 280);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHiddenPage, pathname]);

  if (isHiddenPage) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <FiArrowUp className="back-to-top-icon" aria-hidden="true" />
      <span className="back-to-top-label">back to top</span>
    </button>
  );
};
