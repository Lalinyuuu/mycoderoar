import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider, FollowProvider } from "@/contexts";
import { initSentry, initGA } from "@/utils";
import "./index.css";

// Initialize Sentry
initSentry();

// Initialize Google Analytics
initGA();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FollowProvider>
          <App />
        </FollowProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);