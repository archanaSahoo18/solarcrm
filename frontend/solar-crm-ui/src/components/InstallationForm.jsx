import { useState, useEffect } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./installation.css";
import InstallationTimeline from "./InstallationTimeline";

export default function InstallationForm({ customerId, onSuccess, existingInstallation, onCancel }) {

  const FILE_URL = process.env.REACT_APP_FILE_URL;

  // ✅ FIX: Clean initial state (no dependency on props here)
  const [form, setForm] = useState({
    teamName: "",
    expense: "",
    installationDate: "",
    status: "SCHEDULED",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [installationId, setInstallationId] = useState(null);

  const isCompleted = existingInstallation?.status === "COMPLETED";


const existingPhoto =
  existingInstallation?.photoUrl ;
 // existingInstallation?.photos?.[0];

  useEffect(() => {
  const fetchInstallation = async () => {
    try {
      const res = await api.get(`/installation/${customerId}`);

      if (res.data) {
        console.log("Fetched Installation:", res.data);

        setForm({
          teamName: res.data.teamName || "",
          expense: res.data.expense || "",
          installationDate: res.data.installationDate
            ? res.data.installationDate.split("T")[0]
            : "",
          status: res.data.status || "SCHEDULED",
          notes: res.data.notes || ""
        });
        setInstallationId(res.data.id);
      }
    } catch (err) {
      console.log("No installation found");
    }
  };

  fetchInstallation();
}, [customerId]);

  // ✅ FIX: Set form ONLY when existingInstallation changes (prevents reset)
  useEffect(() => {

     console.log("Existing Installation:", existingInstallation);
    if (existingInstallation) {
      setForm({
        teamName: existingInstallation.teamName || "",
        expense: existingInstallation.expense || "",
        installationDate: existingInstallation.installationDate
          ? existingInstallation.installationDate.split("T")[0]
          : "",
        status: existingInstallation.status || "SCHEDULED",
        notes: existingInstallation.notes || ""
      });
    }
  }, [existingInstallation]);

  // ✅ Preview logic
  useEffect(() => {
    if (!photo) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  // ✅ Status flow validation
  const isValidTransition = (current, next) => {
    if (!current) return true;
    if (current === "SCHEDULED" && next === "COMPLETED") return false;
    if (current === "IN_PROGRESS" && next === "SCHEDULED") return false;
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ❗ Prevent downgrade after COMPLETED
    if (
      name === "status" &&
      existingInstallation?.status === "COMPLETED" &&
      value !== "COMPLETED"
    ) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        text: "Cannot change status after completion"
      });
      return;
    }

    // ❗ Status flow validation
    if (name === "status") {
      if (!isValidTransition(existingInstallation?.status, value)) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Flow",
          text: "Follow: Scheduled → In Progress → Completed"
        });
        return;
      }

      

      // ✅ ONLY clear photo (not full form)
      if (value !== "COMPLETED") {
        setPhoto(null);
      }
    }

    // ✅ IMPORTANT: Preserve existing form values
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingPhoto =
      existingInstallation?.photoUrl ;
     // existingInstallation?.photos?.[0];

    // ❗ Expense validation
    if (form.expense < 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Expense",
        text: "Expense cannot be negative"
      });
      return;
    }

    // ❗ Mandatory photo for COMPLETED
    if (form.status === "COMPLETED" && !photo && !existingPhoto) {
      Swal.fire({
        icon: "warning",
        title: "Photo Required",
        text: "Upload proof before marking completed"
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));

      if (photo) {
        formData.append("photo", photo);
      }

      // ✅ Create vs Update fix
if (installationId) {
  await api.put(`/installation/${installationId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
} else {
  await api.post(`/installation/${customerId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

      Swal.fire({
        icon: "success",
        title: "Installation Saved",
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="installation-overlay">
      <div className="installation-card">
        <div className="installation-header">
          <h2>{existingInstallation ? "Update Installation" : "Add Installation"}</h2>
          <button type="button" className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <InstallationTimeline customerId={customerId} />

        <div className="progressBox">
          <div className={`step ${form.status !== "SCHEDULED" ? "done" : ""}`}>
            <span className="stepIcon">📅</span><span>Scheduled</span>
          </div>
          <div className={`step ${form.status === "IN_PROGRESS" || form.status === "COMPLETED" ? "done" : ""}`}>
            <span className="stepIcon">🔧</span><span>In Progress</span>
          </div>
          <div className={`step ${form.status === "COMPLETED" ? "done" : ""}`}>
            <span className="stepIcon">✅</span><span>Completed</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="installation-form">
          <div className="form-grid">
            <div className="form-field">
              <label>Team Name</label>
              <input type="text" name="teamName" value={form.teamName} onChange={handleChange} required placeholder="Enter team name" disabled={isCompleted}/>
            </div>

            <div className="form-field">
              <label>Expense (₹)</label>
              <input type="number" name="expense" value={form.expense} onChange={handleChange} required placeholder="0.00" disabled={isCompleted}/>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Status</label>
            <select
  name="status"
  value={form.status}
  onChange={handleChange}
  disabled={isCompleted}
>
  {form.status === "SCHEDULED" && (
    <option value="SCHEDULED">Scheduled</option>
  )}

  {(form.status === "SCHEDULED" || form.status === "IN_PROGRESS") && (
    <option value="IN_PROGRESS">In Progress</option>
  )}

  <option value="COMPLETED">Completed</option>
</select>
            </div>

            <div className="form-field">
              <label>Date</label>
              <input type="date" name="installationDate" value={form.installationDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required disabled={isCompleted}/>
            </div>
          </div>

        {/* ✅ SHOW UPLOAD ONLY IF NO EXISTING PHOTO */}
{form.status === "COMPLETED" && !existingPhoto && (
  <div className="form-field animate-fade-in">
    <label>
      Installation Proof <span style={{ color: "red" }}>*</span>
    </label>

    <div className="file-upload-container">
      <label
        htmlFor="file-upload"
        className={`file-upload-label ${photo ? "has-file" : ""}${isCompleted ? "disabled-upload" : ""}`}
        style={{ cursor: isCompleted ? "not-allowed" : "pointer", opacity: isCompleted ? 0.6 : 1 }}
      >
        <div className="upload-content">
          <span className="upload-icon-circle">↑</span>
          <div className="upload-text">
            {photo ? (
              <strong>{photo.name}</strong>
            ) : (
              <strong>Click to upload photo</strong>
            )}
            <span>JPG, PNG up to 5MB</span>
          </div>
        </div>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="hidden-input"
          disabled={isCompleted}
        />
      </label>
    </div>
  </div>
)}

{/* ✅ ALWAYS SHOW EXISTING PHOTO (VIEW MODE) */}
{existingPhoto && (
  <div className="image-preview-wrapper" style={{ marginTop: "10px" }}>
    <img
    src={`${FILE_URL}/files/${existingPhoto}`}
      //src={`${FILE_URL}/files/${customerId}/${existingPhoto}`} // ✅ FIXED: Added customerId
      alt="Preview"
      className="previewImage"
    />
  </div>
)}

{/* ✅ SHOW PREVIEW ONLY FOR NEW UPLOAD */}
{preview && !existingPhoto && (
  <div className="image-preview-wrapper" style={{ marginTop: "10px" }}>
    <img src={preview} alt="Preview" className="previewImage" />
    {!isCompleted && (
      <button
        type="button"
        className="remove-photo"
        onClick={() => setPhoto(null)}
      >
        Remove
      </button>
    )}
  </div>
)}

          <div className="form-field">
            <label>Notes</label>
            <textarea name="notes" placeholder="Any specific details..." value={form.notes} onChange={handleChange} disabled={isCompleted}/>
          </div>

          <div className="installation-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Installation"}
            </button>
          </div>
        </form>

        <div className="installation-summary">
          <span>Estimated Total:</span>
          <strong>₹{Number(form.expense || 0).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}