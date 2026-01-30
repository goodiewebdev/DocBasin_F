import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Spinner from "./utils/spinner";
import "./useremailverification.css";

const UserEmailVerification = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const res = await fetch("https://docbasin.onrender.com/api/users/me", {
          headers: {
            Authorization: token,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    fetchUser();
  }, []);

  const ResendVerificationLink = async () => {
    try {
      await fetch(
        "https://docbasin.onrender.com/api/users/resend-verification",
        {
          body: JSON.stringify({ email: user?.email }),
        },
      );
      alert("Verification link resent!");
    } catch (err) {
      console.error("Resend error:", err);
    }
  };

  return (
    <>
      <div className="verification-container">
        {user?.isEmailVerified === true ? (
          <div className="status-card success">
            <h2>User Verified</h2>
            <p>Your email has been successfully confirmed.</p>
            <Link to="/dashboard" className="dashboard-btn">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="status-card pending">
            <h2>Verifying User...</h2>
            <p>Please check your email and click the verification link.</p>
            <Spinner className="spinner-uev"/>
            <p>didn't get link?</p>
            <button className="resend-btn" onClick={ResendVerificationLink}>
              Resend Link
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserEmailVerification;
