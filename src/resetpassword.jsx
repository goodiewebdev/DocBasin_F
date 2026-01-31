import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Hash } from "lucide-react";
import { useMessage } from "./messagecontext";
import "./forgotpassword.css";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      showMessage("Session expired. Please start again.", "error");
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate, showMessage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      return showMessage("Passwords do not match.", "error");
    }

    setLoading(true);

    try {
      const res = await fetch("https://docbasin.onrender.com/api/users/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("Password reset successful!", "success");
        localStorage.removeItem("resetEmail");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showMessage(data.message || "Reset failed. Please try again.", "error");
      }
    } catch (err) {
      console.error("Reset Password error:", err);
      showMessage("Server connection failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <div className="status-card">
        <h2>Reset Password</h2>
        <p className="status-text">
          Enter the 6-digit code sent to <strong>{email}</strong> and your new password.
        </p>

        <form className="verification-form" onSubmit={handleResetPassword}>
          <div className="input-group">
            <Hash size={20} style={{ marginLeft: "10px", color: "#666" }} />
            <input
              className="reset-input-field"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
              maxLength="6"
            />
          </div>

          <div className="input-group">
            <Lock size={20} style={{ marginLeft: "10px", color: "#666" }} />
            <input
              className="reset-input-field"
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} style={{ marginLeft: "10px", color: "#666" }} />
            <input
              className="reset-input-field"
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button className="resend-btn" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div className="footer-links">
          <Link to="/forgotpassword" size={20} className="back-link">
            Get OTP again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;