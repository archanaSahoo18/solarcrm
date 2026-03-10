import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./installation.css";

export default function InstallationForm({ customerId, onSuccess ,onCancel  }) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    teamName: "",
    expense: "",
    installationDate: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      setLoading(true);

      try {
    await api.post(`/installation/${customerId}`, {
      ...form,
      expense: Number(form.expense)
    });

      Swal.fire({
        icon: "success",
        title: "Installation Added",
        timer: 1500,
        showConfirmButton: false
      });

      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Something went wrong"
      });
    }finally {
    setLoading(false);
  }
  };

return (
  <div className="installation-overlay">
    <div className="installation-card">

      <div className="installation-header">
        <h2>Add Installation</h2>
        <button 
          type="button"
          className="close-btn"
          onClick={onCancel}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
<div className="form-field">
        <input
          type="text"
          name="teamName"
          placeholder="Team Name"
          value={form.teamName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="expense"
          placeholder="Expense"
          value={form.expense}
          onChange={handleChange}
          required
        />

<select
  name="status"
  value={form.status || "SCHEDULED"}
  onChange={handleChange}
>
  <option value="SCHEDULED">Scheduled</option>
  <option value="IN_PROGRESS">In Progress</option>
  <option value="COMPLETED">Completed</option>
</select>

<input
  type="date"
  name="installationDate"
  value={form.installationDate}
  onChange={handleChange}
  min={new Date().toISOString().split("T")[0]}
  required
/>

<textarea
  name="notes"
  placeholder="Installation notes (optional)"
  value={form.notes || ""}
  onChange={handleChange}
/>

<p className="installCustomer">Customer ID: {customerId}</p>

        <div className="installation-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

       <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Installation"}
        </button>
        </div>
</div>
      </form>

<div className="installation-summary">
  <p>
    Installation Cost: ₹{Number(form.expense || 0).toLocaleString()}
  </p>
</div>

    </div>
  </div>
);
}