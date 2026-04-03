// src/main.tsx
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Wrap App for Router context
import App from "./App";

// CSS imports
import "./index.css"; // your own styles
import "@picocss/pico/css/pico.min.css"; // Pico CSS

// Render the app
const container = document.getElementById("root");
if (!container) throw new Error("Root container not found");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);