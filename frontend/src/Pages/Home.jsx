import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../App.css";

const printOptions = [
  { name: "B/W Print", price: "₹2 per page", image: "https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?q=80&w=404&auto=format&fi=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Color Print", price: "₹5 per page", image: "https://images.unsplash.com/photo-1534082753658-1dcb40af5719?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Hard Binding", price: "₹100", image: "https://plus.unsplash.com/premium_photo-1677187301411-eaab5702a215?q=80&w=923&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Spiral Binding", price: "₹30", image: "https://images.unsplash.com/photo-1626641488286-33dfe6425cb4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Passport Photo Print", price: "₹50 (Pack of 6)", image: "https://images.unsplash.com/photo-1616628188550-808682f3926d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Glossy Print", price: "₹20 per photo", image: "https://images.unsplash.com/photo-1551526599-192e64101388?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Lamination", price: "₹20", image: "https://images.unsplash.com/photo-1633491735474-32f6a9bd1df1?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Resume/CV", price: "₹5 per page", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Aadhar/PAN Card", price: "₹50 (Print & Lamination)", image: "https://images.unsplash.com/photo-1663789049904-a1e1e216c829?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Sidebar - visible only on desktop (CSS handles visibility) */}


      {/* Main content */}
      <div className="home-container">
        <div className="top-icon">
          <i className="fa fa-user-circle"></i>
        </div>

        <p className="subtext">Print Fast, Skip the Queue</p>

        <button className="print-now" onClick={() => navigate("/form")}>
          PRINT NOW
        </button>

        <div className="grid">
          {printOptions.map((item, index) => (
            <div
              key={index}
              className="grid-item"
              onClick={() =>
                navigate("/form", { state: { printType: item.name } })
              }
            >
              <img src={item.image} alt={item.name} className="grid-img" />
              <div className="overlay-text">
                <p className="item-title">{item.name}</p>
                <p className="item-price">{item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="status-link">

          <Link to="/queue" >Check Printing Status →</Link>

        </div>
      </div>
    </div>
  );
}

export default Home;
