import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ theme, setTheme }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="logo">🎨 Matty AI</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/editor">Editor</Link>
      </div>

      <div className="navbar-right">
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
