import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import withRouter from "../hooks/withRouter";
import AppRoutes from "./routes";
import Headermain from "../header";
import "./App.css";

function _ScrollToTop(props) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return props.children;
}
const ScrollToTop = withRouter(_ScrollToTop);

export default function App() {
  useEffect(() => {
    // Restore default cursor
    document.body.style.cursor = 'default';
    
    // Remove cursor: none from clickable elements
    const clickableElements = document.querySelectorAll('a, button, input, select, textarea, .link');
    clickableElements.forEach((el) => {
      if (el.style.cursor === 'none') {
        el.style.cursor = 'pointer';
      }
    });
    
    return () => {
      document.body.style.cursor = '';
    };
  }, []);
  
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ScrollToTop>
        <Headermain />
        <AppRoutes />
      </ScrollToTop>
    </Router>
  );
}
