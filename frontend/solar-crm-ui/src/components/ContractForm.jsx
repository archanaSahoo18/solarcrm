import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./contract.css";

export default function ContractForm({ customerId,existingContract, onSuccess, onCancel }) {


  const FILE_URL = process.env.REACT_APP_FILE_URL;

  const [contractFile, setContractFile] = useState(null);

  const [form, setForm] = useState({
    contractNumber: "",
    systemSize: "",
    totalPrice: "",
    signedDate: ""
  });

  const isCompleted = !!existingContract?.fileUrl;

    useEffect(() => {
    if (existingContract) {
      setForm({
        contractNumber: existingContract.contractNumber || "",
        systemSize: existingContract.systemSize || "",
        totalPrice: existingContract.totalPrice || "",
        signedDate: existingContract.signedDate
          ? existingContract.signedDate.split("T")[0]
          : ""
      });
    }
  }, [existingContract]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


      if (isCompleted) {
      Swal.fire({
        icon: "info",
        title: "Already Uploaded",
        text: "Contract already exists"
      });
      return;
    }

    const formData = new FormData();
    formData.append("contractNumber", form.contractNumber);
    formData.append("systemSize", form.systemSize);
    formData.append("totalPrice", form.totalPrice);
    formData.append("signedDate", form.signedDate);
    if (contractFile) formData.append("file", contractFile);

    try {
      await api.post(`/contracts/${customerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      Swal.fire({ icon: "success", title: "Contract Added", timer: 1200, showConfirmButton: false });
      onSuccess();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Something went wrong" });
    }
  };

  return (
    <div className="contract-overlay">
      <div className="contract-card">
        <div className="contract-header">
      <h2>{isCompleted ? "View Contract" : "Add New Contract"}</h2>

          <span className="closeBtn" onClick={onCancel}>✕</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Contract Details</label>
            <input
              name="contractNumber"
              placeholder="Contract Number (e.g. #CON-101)"
              value={form.contractNumber}
              onChange={handleChange}
              required
              disabled={isCompleted}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>System Size (kW)</label>
              <input
                name="systemSize"
                placeholder="5.0"
                value={form.systemSize}
                onChange={handleChange}
                required
                    disabled={isCompleted}
              />
            </div>
            <div className="form-group">
              <label>Total Price (₹)</label>
              <input
                name="totalPrice"
                placeholder="0.00"
                type="number"
                value={form.totalPrice}
                onChange={handleChange}
                required
                    disabled={isCompleted}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Signed Date</label>
            <input
              type="date"
              name="signedDate"
              value={form.signedDate}
              onChange={handleChange}
              required
                  disabled={isCompleted}
            />
          </div>

         {/* ✅ Show file OR upload */}
         {isCompleted ? (
  <div className="form-group">
    <label>Uploaded Contract</label>
    <a
  href={`${FILE_URL}/files/${existingContract.fileUrl}`}
  target="_blank"
  rel="noopener noreferrer"
>
  📄 View Contract
</a>

<a
  href={`${FILE_URL}/files/${existingContract.fileUrl}`}
  download
>
  ⬇ Download
</a>

  </div>
) : (
          <div className="form-group">
            <label>Upload Signed Document</label>
            <label htmlFor="file-upload" className={`file-drop-area ${contractFile ? 'has-file' : ''}`}>
              <span className="file-icon">{contractFile ? '📄' : '📤'}</span>
              <div className="file-msg">
                {contractFile ? (
                  <span className="file-name-label">{contractFile.name}</span>
                ) : (
                  <><strong>Click to upload</strong> or drag file</>
                )}
              </div>
              <input
                id="file-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => setContractFile(e.target.files[0])}
                required
              />
            </label>
          </div>

              )}

          <div className="contract-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-save">Save Contract</button>
          </div>
        </form>
      </div>
    </div>
  );
}