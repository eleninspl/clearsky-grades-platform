import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./layout/App.jsx";
import { AuthProvider } from "./auth/AuthContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
