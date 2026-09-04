import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:4000/verify-otp", {
        email,
        otp,
      });

      if (response.data.success) {
        setMessage(response.data.message);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card">
        <h1>ATSCheck</h1>

        <h2>Verify Your Email</h2>

        <p>We have sent a 6-digit verification code to:</p>

        <strong>{email}</strong>

        <form onSubmit={handleSubmit}>
          <label>Enter OTP</label>

          <input
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          {error && <p className="otp-error">{error}</p>}

          {message && <p className="otp-success">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button className="back-login" onClick={() => navigate("/login")}>
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;
