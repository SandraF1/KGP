import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header
      style={{
        width: "100vw", // full viewport width
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        padding: "0.75rem 1.25rem",
        backgroundColor: "#f8f8f8",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "110px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <img
          src="/logo.png"
          alt="Koine Greek Project"
          style={{ height: "90px" }}
        />

        <nav style={{ display: "flex", gap: "1.5rem" }}>
          <Link to="/" style={linkStyle}>
            Home
          </Link>
          <Link to="/lessons" style={linkStyle}>
            Lessons
          </Link>

          <Link to="/terms" style={linkStyle}>
            Terms
          </Link>
          <Link to="/blog" style={linkStyle}>
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
};

// Inline link styles
const linkStyle: React.CSSProperties = {
  margin: "0 0.75rem",
  textDecoration: "none",
  color: "#333",
  fontWeight: 500,
  fontSize: "1.5rem",
};

export default Header;
