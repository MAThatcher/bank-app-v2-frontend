import React, { useState } from "react";
import axios from "axios";
import APIConfig from "../Misc/ApiBaseUrl";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const apiBaseUrl = APIConfig.getBaseUrl();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Basic validation
  const validate = () => {
    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password !== formData.password2) {
      newErrors.password = "Password must match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    if (Object.keys(validate()).length === 0) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/users/register`, {
          email,
          password,
        });
        alert(response.data.message);
      } catch (err) {
        console.error("Error during signup:", err);
        alert("Signup failed. Please try again.");
      }
      setSuccessMessage("Registration successful!");
      setFormData({ email: "", password: "", password2: "" });
      setErrors({});
    } else {
      setErrors("");
      setSuccessMessage("");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.email && <p className="error-message">{errors.email}</p>}
      {errors.password && <p className="error-message">{errors.password}</p>}
      {errors.password && <p className="error-message">{errors.password2}</p>}

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        {/* Password2 */}
        <div className="form-group">
          <label htmlFor="password">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      <button type="button">
        <a href="/">Back</a>
      </button>
    </div>
  );
};

export default Register;
