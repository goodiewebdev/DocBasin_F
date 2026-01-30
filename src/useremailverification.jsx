import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "./utils/spinner";
import "./useremailverification.css";

const UserEmailVerification = () => {
  const [user, setUser] = useState();
  const { verificationId } = useParams();
  const token = localStorage.getItem("token");

  const fetchUserStatus = async () => {
    try {
      if (!token) return;
      const res = await fetch("https://docbasin.onrender.com/api/users/me", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    const performVerification = async () => {
      try {
        const res = await fetch(`https://docbasin.onrender.com/api/users/verify/${verificationId}`);
        const data = await res.json();
        
        if (res.ok) {
          console.log("Verification successful");
        } else {
          console.error(data.message);
        }

        fetchUserStatus();
      } catch (err) {
        console.error("Verification request failed", err);
      }
    };

    if (verificationId) {
      performVerification();
    } else {
      fetchUserStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationId]);

  useEffect(() => {
    if (!user || user.isEmailVerified === true) return;

    const interval = setInterval(fetchUserStatus, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const ResendVerificationLink = async () => {
    try {
      await fetch("https://docbasin.onrender.com/api/users/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ email: user?.email }),
      });
      alert("Verification link resent!");
    } catch (err) {
      console.error("Resend error:", err);
    }
  };

  return (
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
          <Spinner className="spinner-uev" />
          <p>didn't get link?</p>
          <button className="resend-btn" onClick={ResendVerificationLink}>
            Resend Link
          </button>
        </div>
      )}
    </div>
  );
};

export default UserEmailVerification;