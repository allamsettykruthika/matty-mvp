import { useState } from "react";
import axios from "axios";
import "./Login.css";   // ✅ import your CSS

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          username,
          email,
          password,
        });
        alert("Registered successfully, now login!");
        setIsRegister(false);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          email,
          password,
        });
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("Error: " + err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
        <p>
          {isRegister ? (
            <>
              Already have an account?{" "}
              <a href="#" onClick={() => setIsRegister(false)}>
                Login here
              </a>
            </>
          ) : (
            <>
              New user?{" "}
              <a href="#" onClick={() => setIsRegister(true)}>
                Register here
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
