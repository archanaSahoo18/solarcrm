import { useEffect, useState } from "react";
import api from "../api/api";
import  "./installationTimeline.css";

export default function InstallationTimeline({ customerId }) {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await api.get(`/installation/history/${customerId}`);
      setHistory(res.data || []);
    };

    fetchHistory();
  }, [customerId]);

  return (
<div className="timeline-container">
  <h3>Installation Timeline</h3>

  {history.map((item, index) => (
    <div key={index} className="timeline-item">

      <div className="timeline-icon">
        {item.status === "SCHEDULED" && "📅"}
        {item.status === "IN_PROGRESS" && "🔧"}
        {item.status === "COMPLETED" && "✅"}
      </div>

      <div className="timeline-content">

        <h4>{item.status.replace("_", " ")}</h4>

        {/* ✅ SCHEDULED */}
        {item.status === "SCHEDULED" && (
          <>
            <p><strong>Team:</strong> {item.teamName}</p>
            <p><strong>Expense:</strong> ₹{item.expense}</p>
            <p><strong>Date:</strong> {item.installationDate}</p>
          </>
        )}

        {/* ✅ IN PROGRESS */}
        {item.status === "IN_PROGRESS" && (
          <>
            <p>🔧 Installation work is in progress...</p>

            {item.teamName && <p><strong>Team:</strong> {item.teamName}</p>}
            {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
          </>
        )}

        {/* ✅ COMPLETED */}
        {item.status === "COMPLETED" && (
          <>
            <p>✅ Installation completed successfully</p>

            <p><strong>Team:</strong> {item.teamName}</p>
            <p><strong>Expense:</strong> ₹{item.expense}</p>

            {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}

            {/* 🔥 SHOW PHOTO */}
            {item.photoUrl && (
              <img
                src={`${process.env.REACT_APP_FILE_URL}/files/${item.photoUrl}`}
                alt="completion proof"
                className="timeline-image"
              />
            )}
          </>
        )}

        <small>{item.updatedAt}</small>

      </div>
    </div>
  ))}
</div>
  );
}