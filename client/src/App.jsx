// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import Layout from "./components/Layout.jsx"; // ✅ use Layout with Navbar

function App() {
  const [theme, setTheme] = useState("light");
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with Navbar + Layout */}
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

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
