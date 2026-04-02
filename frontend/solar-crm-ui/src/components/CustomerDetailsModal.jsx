import { useEffect, useState } from "react";
import api from "../api/api";
import "./customerModal.css";
import DocumentViewerModal from "./DocumentViewerModal";

export default function CustomerDetailsModal({ customerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  const [notes, setNotes] = useState([]);
const [newNote, setNewNote] = useState("");
const [viewFile, setViewFile] = useState(null);


const fetchNotes = () => {
  if (!customerId) return;

  api.get(`/customers/${customerId}/notes`)
    .then(res => setNotes(res.data))
    .catch(err => console.error(err));
};

const addNote = () => {
  if (!customerId) return;
  if (!newNote.trim()) return;

  api.post(`/customers/${customerId}/notes`, newNote, {
    headers: { "Content-Type": "text/plain" }
  })
  .then(() => {
    setNewNote("");
    fetchNotes();
  })
  .catch(err => console.error(err));
};

useEffect(() => {
  if (!customerId) return;

  setLoading(true);

  api.get(`/customers/${customerId}/details`)
    .then((res) => setData(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));

  api.get(`/customers/${customerId}/activities`)
    .then(res => setActivities(res.data))
    .catch(err => console.error(err));

   fetchNotes();

}, [customerId]);

  if (!customerId) return null;

  const doc = data?.document;
  const fin = data?.finance;
  const inst = data?.installation;
  const con = data?.contract;

  console.log("FULL CUSTOMER DETAILS =>", data);
console.log("DOCUMENT =>", doc);
console.log("AADHAR =>", doc?.aadharFile);
console.log("PAN =>", doc?.panCardFile);
console.log("ELECTRICITY =>", doc?.electricityBillFile);
console.log("AGREEMENT =>", doc?.agreementFile);
console.log("INSTALLATION PHOTO =>", inst?.photoUrl);
console.log("CONTRACT FILE =>", con?.fileUrl);


const getDocFileUrl = (fileName, customerId) =>
  `${process.env.REACT_APP_FILE_URL}/files/${customerId}/${encodeURIComponent(fileName)}`;

const getCommonFileUrl = (fileName) =>
  `${process.env.REACT_APP_FILE_URL}/files/${encodeURIComponent(fileName)}`;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h2 className="modalTitle">{data?.name || "Customer Details"}</h2>
            <p className="modalSub">
              Stage: <b>{data?.stage || "-"}</b>
            </p>
          </div>

          <button className="closeBtn" onClick={onClose}>✕</button>
        </div>

        {loading && <div className="modalLoading">Loading...</div>}

        {!loading && data && (
          <>
            <div className="grid">
              <div className="infoBox">
                <div className="label">Phone</div>
                <div className="value">{data.phone || "-"}</div>
              </div>
              <div className="infoBox">
                <div className="label">Address</div>
                <div className="value">{data.address || "-"}</div>
              </div>
              <div className="infoBox">
                <div className="label">Created At</div>
                <div className="value">{data.createdAt || "-"}</div>
              </div>
            </div>

            <div className="section">
              <h3>Documents</h3>
              {!doc ? (
                <div className="muted">No documents uploaded.</div>
              ) : (
              <ul className="list">
<li>
  Aadhar:
  {doc?.aadharFile ? (
    <button
      className="viewBtn"
      onClick={() =>
        setViewFile({
          url: getDocFileUrl(doc.aadharFile,data.id),
          name: "Aadhar Card"
        })
      }
    >
      View
    </button>
  ) : " Not uploaded"}
</li>

<li>
  PAN Card:
  {doc?.panCardFile ? (
    <button
      className="viewBtn"
      onClick={() =>
        setViewFile({
          url: getDocFileUrl(doc.panCardFile,data.id),
          name: "PAN Card"
        })
      }
    >
      View
    </button>
  ) : " Not uploaded"}
</li>

<li>
  Electricity Bill:
  {doc?.electricityBillFile ? (
    <button
      className="viewBtn"
      onClick={() =>
        setViewFile({
          url: getDocFileUrl(doc.electricityBillFile,data.id),
          name: "Electricity Bill"
        })
      }
    >
      View
    </button>
  ) : " Not uploaded"}
</li>

<li>
  Agreement:
  {doc?.agreementFile ? (
    <button
      className="viewBtn"
      onClick={() =>
        setViewFile({
          url: getDocFileUrl(doc.agreementFile,data.id),
          name: "Agreement"
        })
      }
    >
      View
    </button>
  ) : " Not uploaded"}
</li>

<li>
  Installation Photo:
  {inst?.photoUrl ? (
    <button
      className="viewBtn"
      onClick={() =>
        setViewFile({
          // CHANGE: Use getDocFileUrl so the customerId is included in the path
          url: getDocFileUrl(inst.photoUrl, data.id), 
          name: "Installation Photo"
        })
      }
    >
      View
    </button>
  ) : " Not uploaded"}
</li>

<li>
  Contract:
  {con?.fileUrl ? (
    <button
      className="viewBtn"
      onClick={() =>
        setViewFile({
          // CHANGE: Use getDocFileUrl here as well
          url: getDocFileUrl(con.fileUrl, data.id),
          name: "Contract"
        })
      }
    >
      View
    </button>
  ) : " Not uploaded"}
</li>

</ul>
              )}
            </div>

            <div className="section">
              <h3>Finance</h3>
              {!fin ? (
                <div className="muted">Finance not added.</div>
              ) : (
                <ul className="list">
                  <li>Type: <b>{fin.financeType || "-"}</b></li>
                  <li>Loan Amount: <b>{fin.loanAmount ?? "-"}</b></li>
                  <li>Down Payment: <b>{fin.downPayment ?? "-"}</b></li>
                  <li>Status: <b>{fin.approvalStatus || "-"}</b></li>
                </ul>
              )}
            </div>

            <div className="section">
              <h3>Installation</h3>
              {!inst ? (
                <div className="muted">Installation not added.</div>
              ) : (
                <ul className="list">
                  <li>Team: <b>{inst.teamName || "-"}</b></li>
                  <li>Expense: <b>{inst.expense ?? "-"}</b></li>
                  <li>Date: <b>{inst.installationDate || "-"}</b></li>
                </ul>
              )}
            </div>

    <div className="section">
  <h3>Contract</h3>

  {!con ? (
    <div className="muted">Contract not added.</div>
  ) : (
    <ul className="list">

      <li>
        Contract Number:
        <b>{con.contractNumber || "-"}</b>
      </li>

      <li>
        Signed Date:
        <b>{con.signedDate || "-"}</b>
      </li>

      <li>
        Total Price:
        <b>{con.totalPrice ?? "-"}</b>
      </li>

      <li>
        System Size (KW):
        <b>{con.systemSize ?? "-"}</b>
      </li>

    </ul>
  )}
</div>

<div className="section">
  <h3>Activity Timeline</h3>

  {activities.length === 0 && (
    <div className="muted">No activities yet.</div>
  )}

  {activities.map(act => (
    <div key={act.id} className="timelineItem">
      <div className="timelineDot"></div>
      <div>
        <div className="timelineText">
          {act.description}
        </div>
        <div className="timelineMeta">
          {act.performedBy} • {new Date(act.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  ))}
</div>


<div className="section">
  <h3>Notes</h3>

  <div className="noteInputBox">
    <textarea
      value={newNote}
      onChange={(e) => setNewNote(e.target.value)}
      placeholder="Write internal note..."
    />
    <button onClick={addNote}>Add Note</button>
  </div>

  {notes.length === 0 && (
    <div className="muted">No notes yet.</div>
  )}

  {notes.map(note => (
    <div key={note.id} className="noteCard">
      <div className="noteText">{note.content}</div>
      <div className="noteMeta">
        {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
      </div>
    </div>
  ))}
</div>


{viewFile && (
  <DocumentViewerModal
    fileUrl={viewFile.url}
    fileName={viewFile.name}
    onClose={() => setViewFile(null)}
  />
)}
          </>
        )}
      </div>
    </div>
  );
}