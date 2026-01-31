import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { useMessage } from "./messagecontext";
import "./forgotpassword.css"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://docbasin.onrender.com/api/users/sendresetotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("OTP sent successfully! Check your email.", "success");
        localStorage.setItem("resetEmail", email);
        
        setTimeout(() => {
          navigate("/resetpassword");
        }, 1500);
      } else {
        showMessage(data.message || "Could not find an account with that email.", "error");
      }
    } catch (err) {
      console.error("Forgot Password error:", err);
      showMessage("Server connection failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Forgot Password</h2>
        
        <p className="smallTexts3">
          Enter your email address to receive a 6-digit reset code.
        </p>

        <form onSubmit={handleSendOtp}>
          <div className="input-group">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              spellCheck="false"
              autoComplete="off"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <p className="textToLoginLink">
          Remember your password?{" "}
          <span className="linkToLink">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;