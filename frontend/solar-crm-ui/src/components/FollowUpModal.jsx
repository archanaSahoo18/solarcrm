import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";

function FollowUpModal({ customerId, onClose, onSuccess }) {

  const [form, setForm] = useState({
    title: "",
    notes: "",
    followUpDate: "",
    reminderEnabled: true
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveFollowUp = async () => {

    if(!form.title || !form.followUpDate){
      Swal.fire({
        icon:"warning",
        title:"Missing fields",
        text:"Title and Follow-Up Date are required"
      });
      return;
    }

    try {

      await api.post(`/followups/${customerId}`, form);

      Swal.fire({
        icon: "success",
        title: "Follow-up scheduled",
        timer: 1500,
        showConfirmButton: false
      });

      setForm({
        title:"",
        notes:"",
        followUpDate:"",
        reminderEnabled:true
      });

      onSuccess();

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to save follow-up"
      });

    }
  };

return (
  <div className="modalOverlay">

    <div className="modalContent">

      <h3>Schedule Follow-Up</h3>

      <label className="checkboxRow">
        <input
          type="checkbox"
          name="reminderEnabled"
          checked={form.reminderEnabled}
          onChange={(e)=>setForm({...form, reminderEnabled:e.target.checked})}
        />
        Enable Reminder Notification
      </label>

      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes"
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="followUpDate"
        onChange={handleChange}
      />

      <div className="modalActions">
        <button onClick={saveFollowUp}>Save Follow-Up</button>
        <button onClick={onClose}>Cancel</button>
      </div>

    </div>

  </div>
);
}

export default FollowUpModal;