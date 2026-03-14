import React, { StrictMode } from "react"; // <-- import React here
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "@picocss/pico/css/pico.min.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
