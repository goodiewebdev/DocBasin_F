import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "./messagecontext";
import "./signup.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { showMessage } = useMessage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://docbasin.onrender.com/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          "Account creation failed: " + (data.message || "Please try again"),
          "error",
        );
        return;
      }

      showMessage("Account created successfully! Login", "success");
      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(error);
      showMessage("Server error", "success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={20} />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>

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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="formMessageTwo">{message}</p>}

        <p className="smallTexts2">
          By signing up you agree to contactbin's <b>Terms of Service</b> and{" "}
          <b>Privacy Policy</b>, and agree to receive marketing communications
          from contactbin at the email address provided. This page is protected
          by reCAPTCHA and is subject to Google's <b>Terms of Service</b> and{" "}
          <b>Privacy Policy</b>.
        </p>

        <p className="textToLoginLink">
          Have an account?{" "}
          <span className="linkToLink">
            <Link to="/login">Login</Link>
          </span>
        </p>
      </div>

      {/*<div className="signup-image">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Signup"
        />
      </div>*/}
    </div>
  );
};

export default SignUp;
