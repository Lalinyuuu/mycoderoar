import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider, FollowProvider } from "@/contexts";
import { initSentry, initGA } from "@/utils";
import "./index.css";

// Initialize Sentry
initSentry();

// Initialize Google Analytics
initGA();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FollowProvider>
          <App />
        </FollowProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);