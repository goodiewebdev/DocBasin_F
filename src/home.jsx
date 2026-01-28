import React, { useState, useEffect } from "react";
import "./home.css";

const Home = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setMessage("You are already logged in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAuthenticated) {
      setMessage("You are already Loggedin.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://docbasin.onrender.com/api/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
      } else {
        setMessage("Signup successful!");
        setFormData({ email: "", password: "" });
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="introHeader">
        <div>
          <h1>
            Build waitlist, <span className="yellowGreen">capture leads</span>{" "}
            seamlessly
          </h1>
          <p className="fboad">For non developers and developers</p>
        </div>

        <div>
          <p className="formIntro">
            Use this tool <span className="formIntroHighlight">for FREE</span>
          </p>

          {isAuthenticated ? (
            <p className="formMessage">
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                  spellCheck="false"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your Password"
                  spellCheck="false"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Get Started"}
              </button>
            </form>
          )}

          {message && <p className="formMessage">{message}</p>}

          <p className="smallTexts">
            By signing up you agree to ContactBin's <b>Terms of Service</b> and{" "}
            <b>Privacy Policy</b>, and agree to receive marketing communications
            from ContactBin at the email address provided. This page is protected
            by reCAPTCHA and is subject to Google's <b>Terms of Service</b> and{" "}
            <b>Privacy Policy</b>.
          </p>
        </div>
      </section>

      <section className="sectionTwo">
        <div className="sectionTwoSub">
          <div className="sectionTwoSubOne">
            <p className="sectionTwoTextTag">How this works</p>
            <h2>Create forms using different methods</h2>
            <p className="fboad">
              Whether you want to use a prebuilt landing page or link a post API
              to your own created form on your website, ContactBin does the job.
            </p>
          </div>

          <div className="sectionTwoSubTwo">
            <div className="hcard">
              <p className="cardHeading">For Non Developers</p>
              <ul>
                <li>Capture leads using a landing page</li>
                <li>Manage leads via dashboard</li>
                <li>Chose form from multiple templates</li>
              </ul>
              <p className="cardOtherButton">Coming Soon</p>
            </div>

            <div className="hcard">
              <p className="cardHeading">For Developers</p>
              <ul>
                <li>Capture leads using a POST API link</li>
                <li>Manage leads via dashboard</li>
                <li>Integrate anywhere outside ContactBin</li>
              </ul>
              <p className="cardOtherButton">Read Docs</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
