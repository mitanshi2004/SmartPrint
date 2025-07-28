import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../utils";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [LoginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  let handleInputChange = (event) => {
    let fieldChange = event.target.name;
    let newvalue = event.target.value;
    setLoginInfo((currData) => ({
      ...currData,
      [fieldChange]: newvalue
    }));
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = LoginInfo;

    if (!email || !password) {
      return handleError("All Items are Required");
    }

    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(LoginInfo)
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message || "Something went wrong";
        handleError(details);
      } else {
        handleError(message || "Login failed");
      }
    } catch (err) {
      handleError("Server error");
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Welcome to <span style={{ color: "#b4e400" }}>SmartPrint</span></h2>
        <p style={{ textAlign: "center", fontWeight: "bold" }}>
          From Classroom to Printroom Instantly
        </p>
        <h3>LOGIN</h3>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span>📧</span>
            <input
              type="email"
              name="email"
              value={LoginInfo.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>

          <div className="input-group">
            <span>🔒</span>
            <input
              type="password"
              name="password"
              value={LoginInfo.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>

          <p style={{ textAlign: "right", fontSize: "12px" }}>Forget Password?</p>
          <button type="submit">Log In</button>
        </form>

        <p style={{ textAlign: "center", fontSize: "12px", marginTop: "10px" }}>
          or Login with <b>Google</b> Accounts
        </p>
        <p style={{ textAlign: "center", fontSize: "12px" }}>
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
