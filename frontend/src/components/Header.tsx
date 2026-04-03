import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        backgroundColor: "#f8f8f8",
        borderBottom: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo on left */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png" // ← public folder path
          alt="Koine Greek Project"
          style={{ height: "40px", marginRight: "0.5rem" }}
        />
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          Koine Greek
        </span>
      </div>

      {/* Navigation Links */}
      <nav>
        <Link to="/" style={linkStyle}>
          Home
        </Link>
        <Link to="/terms" style={linkStyle}>
          Terms
        </Link>
        <Link to="/blog" style={linkStyle}>
          Blog
        </Link>
      </nav>
    </header>
  );
};

// Inline link styles
const linkStyle: React.CSSProperties = {
  margin: "0 0.75rem",
  textDecoration: "none",
  color: "#333",
  fontWeight: 500,
};

export default Header;