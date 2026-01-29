import React from "react";
import "./404page.css";

const NotFound = () => {
  return (
    <main className="nf-container" role="main">
      <section className="nf-card">
        <span className="nf-badge">404 error</span>

        <h1 className="nf-title">Page not found</h1>

        <p className="nf-description">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="nf-actions">
          <a href="/" className="nf-btn nf-btn-primary">
            Go home
          </a>

          <button
            className="nf-btn nf-btn-secondary"
            onClick={() => window.history.back()}
          >
            Go back
          </button>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
