import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hash } from "lucide-react";
import { useMessage } from "./messagecontext";
import "./forgotpassword.css";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const sendOtpOnMount = async () => {
      setSendingEmail(true);
      try {
        const res = await fetch("https://docbasin.onrender.com/api/users/sendotp", {
          method: "POST",
          headers: {
            Authorization: token,
          },
        });
        const data = await res.json();
        if (res.ok) {
          showMessage("A fresh verification code has been sent to your email.", "success");
        } else {
          showMessage(data.message || "Failed to send verification code.", "error");
        }
      } catch (err) {
        console.error("Auto-send error:", err);
      } finally {
        setSendingEmail(false);
      }
    };

    sendOtpOnMount();
  }, [navigate, showMessage]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (otp.length < 6) {
      return showMessage("Please enter the full 6-digit code.", "error");
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://docbasin.onrender.com/api/users/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("Account verified successfully!", "success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        showMessage(data.message || "Invalid or expired OTP", "error");
      }
    } catch (err) {
      console.error("Verification error:", err);
      showMessage("Connection error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <div className="status-card">
        <h2>Verify Your Account</h2>
        <p className="status-text">
          {sendingEmail
            ? "Requesting a new verification code..."
            : "Please enter the 6-digit code sent to your email to activate your dashboard."}
        </p>

        <form className="verification-form" onSubmit={handleVerify}>
          <div className="input-group">
            <Hash size={20} className="sidebar-icon" />
            <input
              className="reset-input-field"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
              maxLength="6"
              autoComplete="one-time-code"
              spellCheck="false"
            />
          </div>

          <button className="resend-btn" type="submit" disabled={loading || sendingEmail}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="footer-links">
          <p className="smallTexts3">
            Didn't get a code?{" "}
            <span className="linkToLink" onClick={() => window.location.reload()}>
              Resend Code
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;