import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Import the CSS below
import "./First.css"

function First() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 7000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="first-wrapper">
      <div className="smartprint-box">SmartPrint</div>
    </div>
  );
}

export default First;
