// LoginPage.js
import React, { useState } from "react";
//import '../Css/LoginPage.css';
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import APIConfig from "../Misc/ApiBaseUrl";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 
  const apiBaseUrl = APIConfig.getBaseUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`${apiBaseUrl}/api/users/login`);
    try {
      const response = await axios.post(`${apiBaseUrl}/api/users/login`, {
        email,
        password,
      });

      setError("");
      setSuccess("Login successful!");

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("Login successful, token saved!");

      navigate("/Dashboard");
    } catch (err) {
      setSuccess("");
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div className="forgot-password">
        <p><a href="/ForgotPassword">Forgot your password?</a></p>
        {/* TODO Setup forgot password button */}
      </div>
      <div className="Create Account">
        <p>
          <a href="/Register">Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
