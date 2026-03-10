import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./contract.css";

export default function ContractForm({ customerId, onSuccess, onCancel }) {

  const [form, setForm] = useState({
    contractNumber: "",
    systemSize: "",
    totalPrice: "",
    signedDate: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/contracts/${customerId}`, form);

      // Move to COMPLETED
      await api.put(`/customers/${customerId}/stage?stage=COMPLETED`);

      Swal.fire({
        icon: "success",
        title: "Contract Added",
        timer: 1200,
        showConfirmButton: false
      });

      onSuccess();

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Something went wrong"
      });
    }
  };

  return (
    <div className="contract-overlay">
      <div className="contract-card">

       <div className="contract-header">
     <h2>Add Contract</h2>
      <span className="closeBtn" onClick={onCancel}>✕</span>
   </div>
        <form onSubmit={handleSubmit}>

          <input
            name="contractNumber"
            placeholder="Contract Number"
            value={form.contractNumber}
            onChange={handleChange}
            required
          />

          <input
            name="systemSize"
            placeholder="System Size (kW)"
            value={form.systemSize}
            onChange={handleChange}
            required
          />

          <input
            name="totalPrice"
            placeholder="Total Price"
            type="number"
            value={form.totalPrice}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="signedDate"
            value={form.signedDate}
            onChange={handleChange}
            required
          />

          <div className="contract-actions">
            <button type="button" onClick={onCancel}>Cancel</button>
            <button type="submit">Save Contract</button>
          </div>

        </form>

      </div>
    </div>
  );
}