import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  const token = localStorage.getItem("token"); // Check auth token

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={token ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/editor"
          element={token ? <Layout><Editor /></Layout> : <Navigate to="/login" />}
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
