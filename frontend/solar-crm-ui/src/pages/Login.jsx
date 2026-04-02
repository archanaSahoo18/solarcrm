import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      Swal.fire({ 
        icon: "warning", 
        title: "Required", 
        text: "Please enter both username and password.",
        confirmButtonColor: "#4f46e5" 
      });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);
      
      Swal.fire({ icon: "success", title: "Success!", timer: 1500, showConfirmButton: false });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Login Failed", text: "Invalid username or password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginHeader">
          <div className="logoCircle">☀️</div>
          <h2>Solar CRM</h2>
          <p>Sign in to manage your solar projects</p>
        </div>

        <div className="formGroup">
          <label htmlFor="username">Username</label>
          <div className="inputWrapper">
            <span className="inputIcon">👤</span>
            <input
              id="username"
              type="text"
              placeholder="e.g. admin_solar"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
        </div>

        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <div className="inputWrapper">
            <span className="inputIcon">🔒</span>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        <button 
          className="loginButton" 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? "Authenticating..." : "Login to Dashboard"}
        </button>

        <div className="loginFooter">
          <p>Internal Access Only</p>
        </div>
      </div>
    </div>
  );
}