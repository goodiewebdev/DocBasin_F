import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "./messagecontext";
import "./signup.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://docbasin.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Login failed", "error");
        return;
      }

      localStorage.setItem("token", data.token);
      showMessage("Login successful!", "success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (err) {
      console.error(err);
      showMessage("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Welcome Back</h2>

        <form onSubmit={handleSubmit}>
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
              autoCorrect="off"
            />
          </div>

          <div className="input-group password-group">
            <Lock size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="smallTexts2">
          This page is protected by reCAPTCHA and is subject to Google's{" "}
          <b>Terms of Service</b> and <b>Privacy Policy</b>.
        </p>

        <p className="textToLoginLink">
          Don’t have an account?{" "}
          <span className="linkToLink">
            <Link to="/signup">Sign Up</Link>
          </span>
        </p>
      </div>

      <div className="signup-image">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          alt="Login"
        />
      </div>
    </div>
  );
};

export default Login;
