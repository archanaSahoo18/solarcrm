import { FiClock, FiAlertCircle } from "react-icons/fi";

export default function FollowupSummaryCard({ title, count, type }) {
  return (
    <div className={`summary-card ${type}`}>
      <div className="icon">
        {type === "overdue" ? <FiAlertCircle /> : <FiClock />}
      </div>
      <div>
        <h4>{title}</h4>
        <h2>{count}</h2>
      </div>
    </div>
  );
}