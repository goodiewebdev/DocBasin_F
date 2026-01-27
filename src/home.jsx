import React, { useState } from "react";
import "./home.css";

const Home = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Something went wrong");
      } else {
        setMessage("Contact added successfully!");
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
          <p className="fboad">For business owners and developers</p>
        </div>
        <div>
          <p className="formIntro">
            Use this tool <span className="formIntroHighlight">for FREE</span>
          </p>
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
                type="text"
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
            <p>
              <h2>Capture leads using different methods</h2>
            </p>
            <p className="fboad">
              Whether you want to use a prebuilt landing page or link a post API
              to your own created form on your website, ContactBin does the job.
            </p>
          </div>
          <div className="sectionTwoSubTwo">
            <div className="hcard">
              <p className="cardHeading">For Business Owners</p>
              <ul>
                <li>Capture leads using a landing page</li>
                <li>Manage leads via dashboard</li>
                <li>Chose form from multiple templates</li>
              </ul>
            </div>
            <div className="hcard">
              <p className="cardHeading">For Technicians</p>
              <ul>
                <li>Capture leads using a POST API link</li>
                <li>Manage leads via dashboard</li>
                <li>Integrate anywhere outside ContactBin</li>
              </ul>
              <p className="cardOtherButton">Read Docs</p>
            </div>
          </div>
          <div></div>
        </div>
      </section>
    </>
  );
};

export default Home;
