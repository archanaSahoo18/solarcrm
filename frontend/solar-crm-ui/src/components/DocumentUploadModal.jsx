import { useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./pipeline.css";
import DocumentViewerModal from "./DocumentViewerModal";

function DocumentUploadModal({ customerId, onSuccess, onCancel }) {

  const [aadhar, setAadhar] = useState(null);
  const [panCard,setPanCard] = useState(null);
  const [bill, setBill] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [installationPhoto, setInstallationPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

 const handleUpload = async () => {

  if (!aadhar || !panCard || !bill || !agreement || !installationPhoto) {
    Swal.fire({
      icon: "warning",
      title: "All documents are required",
      text: "Please upload all documents before submitting"
    });
    return;
  }

  const formData = new FormData();

  formData.append("aadhar", aadhar);
  formData.append("panCard", panCard);
  formData.append("electricityBill", bill);
  formData.append("agreement", agreement);
  formData.append("installationPhoto", installationPhoto);

  
try {
  setLoading(true);

  await api.post(`/documents/upload/${customerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  // move stage to DOCUMENTS
  await api.put(`/customers/${customerId}/stage?stage=DOCUMENTS`);

  Swal.fire({
    icon: "success",
    title: "Documents Uploaded",
    timer: 1200,
    showConfirmButton: false
  });

  onSuccess();

} catch (err) {
  Swal.fire({
    icon: "error",
    title: "Upload Failed",
    text: err.response?.data?.message || "Something went wrong"
  });
 
} finally {
    setLoading(false);
  }
};

  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <h3>Upload Documents</h3>

   <div className="fileGroup">
<label>Aadhar <span className="required">*</span></label>

<input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={e => setAadhar(e.target.files[0])}
/>

{aadhar && (
  <div className="filePreview">
    {aadhar.type.includes("image") ? (
      <img src={URL.createObjectURL(aadhar)} alt="preview"/>
    ) : (
      <span>{aadhar.name}</span>
    )}
  </div>
)}
</div>
   <div className="fileGroup">
<label>PAN Card <span className="required">*</span></label>

<input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={e => setPanCard(e.target.files[0])}
/>

{panCard && (
  <div className="filePreview">
    {panCard.type.includes("image") ? (
      <img src={URL.createObjectURL(panCard)} alt="preview"/>
    ) : (
      <span>{panCard.name}</span>
    )}
  </div>
)}
</div>
<div className="fileGroup">
<label>Electricity Bill <span className="required">*</span></label>

<input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={e => setBill(e.target.files[0])}
/>

{bill && (
  <div className="filePreview">
    {bill.type.includes("image") ? (
      <img src={URL.createObjectURL(bill)} alt="preview"/>
    ) : (
      <span>{bill.name}</span>
    )}
  </div>
)}
</div>

   <div className="fileGroup">
<label>Agreement <span className="required">*</span></label>

<input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={e => setAgreement(e.target.files[0])}
/>

{agreement && (
  <div className="filePreview">
    {agreement.type.includes("image") ? (
      <img src={URL.createObjectURL(agreement)} alt="preview"/>
    ) : (
      <span>{agreement.name}</span>
    )}
  </div>
)}
</div>

       <div className="fileGroup">
<label>Installation Photo <span className="required">*</span></label>

<input
  type="file"
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={e => setInstallationPhoto(e.target.files[0])}
/>

{installationPhoto && (
  <div className="filePreview">
    {installationPhoto.type.includes("image") ? (
      <img src={URL.createObjectURL(installationPhoto)} alt="preview"/>
    ) : (
      <span>{installationPhoto.name}</span>
    )}
  </div>
)}
</div>

        <div className="modalActions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentUploadModal;