import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./login.css";
import { useNavigate } from "react-router-dom";

export default function Login({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      Swal.fire({ icon: "warning", title: "Wait!", text: "Credentials are required." });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      Swal.fire({ icon: "success", title: "Welcome Back!", timer: 1500, showConfirmButton: false });
      navigate("/dashboard");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops!", text: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <h2>Solar CRM</h2>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="inputGroup">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Verifying..." : "Sign In"}
        </button>
        {/* <p className="switchText">
          New here? <b onClick={() => navigate("/register")}>Create account</b>
        </p> */}
      </div>
    </div>
  );
}