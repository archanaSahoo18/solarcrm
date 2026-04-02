import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Swal from "sweetalert2";
import { FiUploadCloud, FiCheckCircle, FiFileText } from "react-icons/fi";
import "./addCustomer.css";

export default function AddCustomer() {
  const navigate = useNavigate();
  const addressRef = useRef(null);

  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
  name: "", 
  phone: "", 
  address: "",       // Google-detected area/city
  manualAddress: "", // House/Flat No.
  landmark: "",      // Optional Landmark
  pincode: "",       // 6-digit Pincode
  gender: "", 
  email: ""
});

  const [files, setFiles] = useState({
    aadhar: null, panCard: null, sitePhoto: null,
    bankPassbook: null, electricBill: null,
    agreement: null, customerPhoto: null
  });

  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  // ✅ GOOGLE AUTOCOMPLETE
// ✅ FULL UPDATED USEEFFECT
useEffect(() => {
  if (!window.google || !addressRef.current) return;

  const autocomplete = new window.google.maps.places.Autocomplete(
    addressRef.current,
    {
      types: ["geocode"],
      componentRestrictions: { country: "in" }
    }
  );

autocomplete.addListener("place_changed", () => {
  const place = autocomplete.getPlace();
  if (!place.address_components) return;

  // Find pincode in Google components
  const postCode = place.address_components.find(c => c.types.includes("postal_code"))?.long_name || "";
  
  setForm(prev => ({
    ...prev,
    address: place.formatted_address,
    pincode: postCode // ✅ Automatically fill pincode if Google finds it
  }));
});

  // Cleanup
  return () => {
    window.google.maps.event.clearInstanceListeners(autocomplete);
  };
}, []);

  // ✅ DETECT LOCATION
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation not supported", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
          );

          const data = await res.json();

          if (data.results.length > 0) {
            setForm(prev => ({
              ...prev,
              address: data.results[0].formatted_address
            }));
          }
        } catch (err) {
          Swal.fire("Error", "Failed to fetch address", "error");
        }
      },
      () => {
        Swal.fire("Permission Denied", "Enable location access", "warning");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   const fullAddress = `${form.manualAddress}, ${form.landmark ? form.landmark + ', ' : ''}${form.address} - ${form.pincode}`;


    if (form.phone.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Phone",
        text: "Phone must be 10 digits"
      });
      return;
    }

    const missing = Object.values(files).some(file => file === null);
    if (missing) {
      Swal.fire({
        icon: "warning",
        title: "Missing Docs",
        text: "Please upload all 7 documents"
      });
      return;
    }

const formData = new FormData();
  Object.keys(form).forEach(key => {
    if (key === 'address') {
      formData.append('address', fullAddress); // Save the combined version
    } else {
      formData.append(key, form[key]);
    }
  });



    Object.keys(files).forEach(key => formData.append(key, files[key]));

    try {
      setLoading(true);
      await api.post("/customers/create-with-documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        timer: 1500,
        showConfirmButton: false
      });

      navigate("/pipeline");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Error"
      });
    } finally {
      setLoading(false);
    }
  };

  const FileUploadBox = ({ label, id, accept, capture }) => (
    <div className="upload-box">
      <label>{label} <span className="required">*</span></label>
      <div className={`upload-card ${files[id] ? "uploaded" : ""}`}>
        <input
          type="file"
          id={id}
          accept={accept}
          capture={capture}
          onChange={(e) => handleFileChange(e, id)}
        />
        <label htmlFor={id} className="upload-label">
          {files[id] ? (
            <div className="preview-area">
              {files[id].type.includes("image") ? (
                <img src={URL.createObjectURL(files[id])} alt="preview" />
              ) : (
                <FiFileText size={30} color="#4f46e5" />
              )}
              <span className="file-status">
                <FiCheckCircle /> Selected
              </span>
            </div>
          ) : (
            <div className="placeholder-area">
              <FiUploadCloud size={24} />
              <span>Click to Upload</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  return (
    <div className="add-customer-container">
      <div className="add-customer-card">

        <div className="header-section">
          <h2>Add New Customer</h2>
          <p>Fill in the details and upload required KYC documents</p>
        </div>

        <form onSubmit={handleSubmit} className="add-customer-form">

          <div className="form-grid">
            <div className="input-group">
              <label>Full Name <span className="required">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Gender <span className="required">*</span></label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div className="input-group">
              <label>Phone Number <span className="required">*</span></label>
              <input
                name="phone"
                maxLength="10"
                value={form.phone}
                onChange={(e) =>
                  /^\d*$/.test(e.target.value) &&
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
          </div>


<div className="input-group full-width">
  <label>Location (Area/City) <span className="required">*</span></label>
  <input
    ref={addressRef}
    type="text"
    name="address"
    value={form.address}
    onChange={handleChange}
    placeholder="Search for area, colony, or street..."
    autoComplete="off" // ❗ Removes gray icons
    required
  />
  <button type="button" className="detect-btn" onClick={handleDetectLocation}>
    📍 Use Current Location
  </button>
</div>

<div className="form-grid">
  <div className="input-group">
    <label>House / Flat No. <span className="required">*</span></label>
    <input
      name="manualAddress"
      value={form.manualAddress}
      onChange={handleChange}
      placeholder="e.g. Flat 402"
      required
    />
  </div>

  <div className="input-group">
    <label>Landmark</label>
    <input
      name="landmark"
      value={form.landmark}
      onChange={handleChange}
      placeholder="e.g. Near Apollo Hospital"
    />
  </div>

  <div className="input-group">
    <label>Pincode <span className="required">*</span></label>
    <input
      name="pincode"
      maxLength="6"
      value={form.pincode}
      onChange={(e) => /^\d*$/.test(e.target.value) && handleChange(e)}
      placeholder="6-digit pincode"
      required
    />
  </div>
</div>



          <h3 className="section-title">KYC Documents</h3>

          <div className="document-grid">
            <FileUploadBox label="Aadhar Card" id="aadhar" accept="image/*,.pdf" />
            <FileUploadBox label="PAN Card" id="panCard" accept="image/*,.pdf" />
            <FileUploadBox label="Site Photo" id="sitePhoto" accept="image/*" capture="environment" />
            <FileUploadBox label="Bank Passbook" id="bankPassbook" accept="image/*,.pdf" />
            <FileUploadBox label="Electric Bill" id="electricBill" accept="image/*,.pdf" />
            <FileUploadBox label="User Agreement" id="agreement" accept="image/*,.pdf" />
            <FileUploadBox label="Photo with Customer" id="customerPhoto" accept="image/*" capture="environment" />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : "Register Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}