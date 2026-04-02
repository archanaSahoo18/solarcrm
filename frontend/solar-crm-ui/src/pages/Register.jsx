import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./register.css"; 
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [phoneNum, setPhoneNum] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !phoneNum) {
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
    <div className="wide-register-container">
      <div className="register-card-wide">
        <div className="register-header">
          <h2>Create User Account</h2>
          <p>Register a new member to the Solar CRM platform</p>
        </div>

        <div className="register-form-grid">
          {/* Left Column */}
          <div className="inputGroup">
            <label>Username <span className="req">*</span></label>
            <input
              type="text"
              placeholder="Enter unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label>Mobile Number <span className="req">*</span></label>
            <input
              type="text"
              placeholder="10 digit mobile number"
              value={phoneNum}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) setPhoneNum(value);
              }}
              maxLength="10"
            />
          </div>

          {/* Right Column */}
          <div className="inputGroup">
            <label>Password <span className="req">*</span></label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <label>Access Level / Role <span className="req">*</span></label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="USER">Standard User</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
        </div>

        <div className="register-footer">
          <button className="register-btn" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating Account..." : "Register Now"}
          </button>
          <p className="switchText">
            Already have an account? <span className="link" onClick={() => navigate("/login")}>Sign In</span>
          </p>
        </div>
      </div>
    </div>
  );
}