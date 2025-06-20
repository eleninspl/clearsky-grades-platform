import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./layout/App.jsx";
import { AuthProvider } from "./auth/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1028279250576-sub42afe9f71aoh1s2uqfr0ve00o729n.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
