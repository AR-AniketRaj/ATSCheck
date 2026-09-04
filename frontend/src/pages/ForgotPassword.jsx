import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4000/forgot-password",
        { email },
        {
          withCredentials: true,
        },
      );

      setMessage(response.data.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <h1>ATSCheck</h1>

        <h2>Forgot Password?</h2>

        <p>Enter your email address and we'll help you reset your password.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="forgot-error">{error}</p>}

          {message && <p className="forgot-success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <button className="back-login" onClick={() => navigate("/login")}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
