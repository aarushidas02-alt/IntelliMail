import React from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import "./App.css";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GmailAuth from "./pages/GmailAuth";
import Inbox from "./pages/Inbox";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/gmail-auth"
          element={<GmailAuth />}
        />

        <Route
          path="/inbox"
          element={<Inbox />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;