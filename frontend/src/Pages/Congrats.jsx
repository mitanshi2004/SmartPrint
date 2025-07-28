import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Congrats.css';



function Congrats() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token;

  // 🔁 Auto-redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/queue");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="congrats-wrapper">
      <div className="congrats-box">
        <h1>🎉 Congratulations</h1>
        <p className="sub">Your Token No is</p>
        <p className="token">{token || "N/A"}</p>
        <p className="redirect">Redirecting to queue...</p>
      </div>
    </div>
  );
}

export default Congrats;
