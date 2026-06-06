import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        {
          ...inputValue,
        },
        { withCredentials: true },
      );
      console.log(data);
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-info">
          <h1 className="auth-logo">⚡ ATSCheck</h1>

          <p className="auth-tagline">
            Improve your resume with AI-powered ATS analysis and insights.
          </p>

          <div className="auth-features">
            <div className="auth-feature">✓ Instant ATS Score</div>
            <div className="auth-feature">✓ Resume Keyword Analysis</div>
            <div className="auth-feature">✓ AI Resume Suggestions</div>
            <div className="auth-feature">✓ Recruiter-Friendly Reports</div>
          </div>
        </div>

        <div className="auth-form">
          <h2>Welcome Back</h2>

          <p className="auth-subtitle">
            Login to continue improving your resume with ATSCheck.
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={handleOnChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
                required
              />
            </div>

            <button type="submit">Login</button>

            <p className="auth-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
