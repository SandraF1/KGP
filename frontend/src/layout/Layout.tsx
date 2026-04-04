// Layout.tsx
import React from "react";
import Header from "../components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

const HEADER_HEIGHT = 110; // match your Header height

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <main style={{ flex: 1, paddingTop: `${HEADER_HEIGHT}px` }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
