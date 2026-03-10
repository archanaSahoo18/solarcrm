import { useState } from "react";
import api from "../api/api";
import "./financeForm.css";
import Swal from "sweetalert2";

export default function FinanceForm({ customerId, onSuccess, onCancel }) {

const [loading,setLoading] = useState(false);

  const [form, setForm] = useState({
    financeType: "BANK",
    loanAmount: "",
    downPayment: "",
    approvalStatus: "PENDING",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

      if(Number(form.loanAmount) <= 0){
          setLoading(false);
    Swal.fire("Invalid Loan Amount","Loan must be greater than 0","warning");
    return;
  }

  if(Number(form.downPayment) < 0){
      setLoading(false);
    Swal.fire("Invalid Down Payment","Down payment cannot be negative","warning");
    return;
  }


    const payload = {
      financeType: form.financeType,
      loanAmount: Number(form.loanAmount),
      downPayment: Number(form.downPayment),
      approvalStatus: form.approvalStatus,
    };


    try {
      await api.post(`/finance/${customerId}`,payload);

      setLoading(false);

      //alert("✅ Finance Added Successfully!");
  Swal.fire({
  icon: "success",
  title: "Finance Added",
  timer: 1200,
  showConfirmButton: false
}); 
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);

  Swal.fire({
    icon: "error",
    title: "Finance Failed",
    text:
      err.response?.data?.message ||"Something went wrong"
  });

    } finally {
  setLoading(false);
}
  };

const loan = Number(form.loanAmount || 0);
const down = Number(form.downPayment || 0);
const totalProject = loan + down;

  return (

     <div className="finance-overlay">
      <div className="finance-card">
       <div className="finance-header">
  <h2>Add Finance</h2>

  <button className="close-btn" onClick={onCancel}>
    ✕
  </button>
</div>

        <p className="financeCustomer">
  Customer ID: {customerId}
</p>

        <form onSubmit={handleSubmit} className="finance-form">
          <label>Finance Type</label>
          <select name="financeType" value={form.financeType} onChange={handleChange}>
            <option value="BANK">Bank</option>
            <option value="CASH">Cash</option>
            <option value="NBFC">NBFC</option>
            <option value="SELF_FINANCE">Self Finance</option>
          </select>

          <label>Loan Amount</label>
          <input
            name="loanAmount"
            type="number"
            placeholder="Enter loan amount"
            value={form.loanAmount}
            onChange={handleChange}
            required
          />

          <label>Down Payment</label>
          <input
            name="downPayment"
            type="number"
            placeholder="Enter down payment"
            value={form.downPayment}
            onChange={handleChange}
            required
          />

          <label>Approval Status</label>
          <select
            name="approvalStatus"
            value={form.approvalStatus}
            onChange={handleChange}
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

   <div className="finance-actions">

  <button
    type="button"
    className="btn-secondary"
    onClick={onCancel}
  >
    Cancel
  </button>

  <button
    type="submit"
    className="btn-primary"
    disabled={loading}
  >
    {loading ? "Saving..." : "Save"}
  </button>

</div>
        </form>

        {/* quick summary */}
<div className="finance-summary">

  <p>
    Loan: ₹{loan.toLocaleString()}
  </p>

  <p>
    Down Payment: ₹{down.toLocaleString()}
  </p>

  <hr/>

  <p className="financeTotal">
     Total Project: ₹{totalProject.toLocaleString()}
  </p>

</div>
      </div>
    </div>
  );
}