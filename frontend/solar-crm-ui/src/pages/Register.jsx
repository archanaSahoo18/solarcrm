import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./login.css"; // Uses the same CSS file for a unified look
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
const [phoneNum, setPhoneNum] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password ||!phoneNum) {
      Swal.fire({ icon: "info", title: "Fill in all fields" });
      return;
    }

  if (phoneNum.length !== 10) {
  Swal.fire({
    icon: "warning",
    title: "Invalid Phone Number",
    text: "Phone number must be exactly 10 digits"
  });
  return;
}

    setLoading(true);
    try {
      await api.post("/auth/register", { 
        username, 
        password,
        phoneNum,
         role 
      });
      
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "You can now log in to your dashboard.",
        timer: 2000,
        showConfirmButton: false
      });
      
      // Navigate to login after successful registration
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="loginCard">
        <h2>Join Solar CRM</h2>
        <p className="subtitle">Set up your account to get started</p>

        <div className="inputGroup">
          <input
            type="text"
            placeholder="Choose Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="inputGroup">
  <label style={{ fontSize: "12px", color: "#888" }}>
  Enter a 10 digit mobile number
</label>
  <input
    type="text"
    placeholder="Phone Number (10 digits)"
    value={phoneNum}
    onChange={(e) => {
      const value = e.target.value;

      // Allow only numbers
      if (/^\d*$/.test(value)) {
        setPhoneNum(value);
      }
    }}
    maxLength="10"
  />
</div>

        <div className="inputGroup">
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label style={{ fontSize: '12px', color: '#666', marginLeft: '5px' }}>Account Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="USER">Standard User</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Creating Account..." : "Register Now"}
        </button>

        <p className="switchText">
          Already have an account? <b onClick={() => navigate("/login")}>Sign In</b>
        </p>
      </div>
    </div>
  );
}