import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess, handleError } from "../utils";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
    const [SignupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        phoneNo: ''
    });

    let handleInputChange = (event) => {
        let fieldChange = event.target.name;
        let newvalue = event.target.value;
        setSignupInfo((currData) => ({
            ...currData,
            [fieldChange]: newvalue
        }));
    };
    const navigate = useNavigate();
    let handleSubmit = async (event) => {
        event.preventDefault(); // page reload hone se roko
        const { name, email, password, phoneNo } = SignupInfo;
        if (!name || !email || !password || !phoneNo) {
            return handleError("All Items are Required");
        }
        try {
            const url = "http://localhost:8080/auth/signup";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(SignupInfo) // jo user ne bhara usey bhejna
            })

            const result = await response.json();
            const { success, message, error } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        }
        catch (err) {
            handleError(err);
        }
    };

    return (
        <>
            <div className="container">
                <div className="box">
                    <h2>GET STARTED</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <span>👤</span>
                            <input
                                type="text"
                                name="name"
                                value={SignupInfo.name}
                                onChange={handleInputChange}
                                placeholder="Enter Full Name"
                            />
                        </div>

                        <div className="input-group">
                            <span>📧</span>
                            <input
                                type="email"
                                name="email"
                                value={SignupInfo.email}
                                onChange={handleInputChange}
                                placeholder="Enter a Email"
                            />
                        </div>

                        <div className="input-group">
                            <span>🔒</span>
                            <input
                                type="password"
                                name="password"
                                value={SignupInfo.password}
                                onChange={handleInputChange}
                                placeholder="Enter a Password"
                            />
                        </div>

                        <div className="input-group">
                            <span>📞</span>
                            <input
                                type="text"
                                name="phoneNo"
                                value={SignupInfo.phoneNo}
                                onChange={handleInputChange}
                                placeholder="Enter a Phone No."
                            />
                        </div>

                        <button type="submit">Sign Up</button>
                    </form>

                    <p style={{ textAlign: "center", fontSize: "12px", marginTop: "10px" }}>
                        or Sign Up with <b>Google</b> Accounts
                    </p>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default Signup;