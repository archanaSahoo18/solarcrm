import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Swal from "sweetalert2"; // Swapping alert for Swal
import "./addCustomer.css";

export default function AddCustomer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Added loading state for button feedback

const [form, setForm] = useState({
  name: "",
  phone: "",
  address: "",
  gender: ""
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

if (form.phone.length !== 10) {
  Swal.fire({
    icon: "warning",
    title: "Invalid Phone Number",
    text: "Phone number must be exactly 10 digits"
  });

  setLoading(false);
  return;
}

    setLoading(true);

    try {

await api.post("/customers", form);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Customer Created Successfully!",
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate("/pipeline"); // Navigate to pipeline or dashboard

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Failed to create customer"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-customer-container">
      <div className="add-customer-card">
        <h2>Add New Customer</h2>
        <p style={{ textAlign: 'center', color: '#666', marginTop: '-15px', fontSize: '14px' }}>
          Enter details to expand your reach
        </p>

        <form onSubmit={handleSubmit} className="add-customer-form">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />


<select name="gender" value={form.gender} onChange={handleChange}>
  <option value="">Select Gender</option>
  <option value="MALE">Male</option>
  <option value="FEMALE">Female</option>
  <option value="OTHER">Other</option>
</select>

<small style={{color:"#888"}}>
  Enter a valid 10-digit mobile number
</small>
 <input
  name="phone"
  type="tel"
  placeholder="Phone Number (10 digits)"
  value={form.phone}
  maxLength="10"
  onChange={(e) => {
    const value = e.target.value;

    // allow only numbers
    if (/^\d*$/.test(value)) {
      setForm({
        ...form,
        phone: value
      });
    }
  }}
  required
/>


          <input
            name="address"
            placeholder="Home/Office Address"
            value={form.address}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Create Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}