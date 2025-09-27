import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/globals.css";

// Context providers
import { AuthProvider } from "./contexts/AuthContext.jsx";

// Components
import Layout from "./Layout.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

// Pages (ensure these paths match actual files)
import Dashboard from "./pages/Dashboard.jsx";
import Calendar from "./pages/Calendar.jsx";
import Clients from "./pages/Clients.jsx";
import Summaries from "./pages/Summaries.jsx";
import Billing from "./pages/Billing.jsx";
import Voice from "./pages/Voice.jsx";

// Environment validation
import { validateEnvironment, config } from "./config/env.js";

// Validate environment on startup
try {
  validateEnvironment();
} catch (error) {
  console.error("Environment validation failed:", error.message);
  if (config.app.IS_PRODUCTION) {
    // In production, show a user-friendly error
    document.getElementById("root").innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #111827; color: white; font-family: system-ui;">
        <div style="text-align: center;">
          <h1>Configuration Error</h1>
          <p>The application is not properly configured. Please contact support.</p>
        </div>
      </div>
    `;
    throw error;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/summaries" element={<Summaries />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/voice" element={<Voice />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
