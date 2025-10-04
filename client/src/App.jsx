// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  const [theme, setTheme] = useState("light");

  // Check authentication from localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout theme={theme} setTheme={setTheme}>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/editor"
          element={
            isAuthenticated ? (
              <Layout theme={theme} setTheme={setTheme}>
                <Editor />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Root route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
