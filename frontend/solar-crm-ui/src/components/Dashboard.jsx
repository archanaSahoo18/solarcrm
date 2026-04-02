import { useEffect, useState } from "react";
import api from "../api/api";
import "./dashboard.css";
import { 
  FiUsers, 
  FiUserCheck, 
  FiFileText, 
  FiDollarSign, 
  FiTool, 
  FiCheckCircle 
} from "react-icons/fi";
import RevenueChart from "../components/RevenueChart";
import NotificationBell from "../components/NotificationBell";

function Dashboard() {

  const [data, setData] = useState(null);
  const [todayCount, setTodayCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);

  const [followUpList, setFollowUpList] = useState([]);
  const [followUpTitle, setFollowUpTitle] = useState("");
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const loadLeaderboard = () => {
      api.get("/finance/leaderboard")
     .then(res => setLeaderboard(res.data))
     .catch(err => console.error(err));
  };

  const loadDashboard = () => {
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  const loadFollowUpCounts = () => {
    api.get("/followups/count/today")
      .then(res => setTodayCount(res.data))
      .catch(err => {
  console.error("API ERROR:", err.response?.data || err.message);
});

    api.get("/followups/count/overdue")
      .then(res => setOverdueCount(res.data))
      .catch(err => {
  console.error("API ERROR:", err.response?.data || err.message);
});

console.log(overdueCount);
  };


  const markDone = async (id) => {

  await api.put(`/followups/${id}/complete`);

  loadFollowUpCounts(); 
  loadDashboard();

  setFollowUpList(prev => prev.filter(f => f.id !== id));

};

  useEffect(() => {
    loadLeaderboard();
    loadDashboard();
    loadFollowUpCounts();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      loadDashboard();
      loadFollowUpCounts();
      loadLeaderboard();
    }, 60000);

    return () => clearInterval(interval);

  }, []);

//  if (!data) {
//   return (
//     <div className="dashboardLoading">
//       Loading dashboard...
//     </div>
//   );
// }

if (!data) {
    return (
      <div className="dashboardContainer">
        <div className="statsGrid">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="statCard skeletonCard" style={{ height: '140px', borderRadius: '20px' }} />
          ))}
        </div>
      </div>
    );
  }

  const loadTodayFollowUps = () => {
    api.get("/followups/today")
      .then(res => {
        setFollowUpList(res.data);
        setFollowUpTitle("Today's Follow-Ups");
        setShowFollowUpModal(true);
      });
  };

  const loadOverdueFollowUps = () => {
    api.get("/followups/overdue")
      .then(res => {
        setFollowUpList(res.data);
        setFollowUpTitle("Overdue Follow-Ups");
        setShowFollowUpModal(true);
      });
  };

  return (
    <div className="dashboardContainer">
  <div className="dashboardHeader">

  <div>
    <h2 className="dashboardTitle">Solar CRM Analytics</h2>
    <p className="dashboardSubtitle">
      Real-time overview of your sales pipeline and performance
    </p>
  </div>

  {/* Notification Bell */}
  <div className="headerActions">
    <NotificationBell />
  </div>

</div>

      <div className="statsGrid">
        <div className={`statCard ${todayCount > 0 ? "activeCard" : "neutralCard"}`} onClick={loadTodayFollowUps}>
          <h4>Today's Follow-Ups</h4>
          <p>{todayCount}</p>
        </div>

        <div className={`statCard ${overdueCount > 0 ? "dangerCard" : "neutralCard"}`} onClick={loadOverdueFollowUps}>
          <h4>Overdue Follow-Ups</h4>
          <p>{overdueCount}</p>
        </div>




        {/* --- Data Stats --- */}
        {[
          { label: "Total Customers", val: data.totalCustomers, icon: <FiUsers />, color: "blue" },
          { label: "Identification", val: data.identificationCount, icon: <FiUserCheck />, color: "yellow" },
          { label: "Documents", val: data.documentsCount, icon: <FiFileText />, color: "orange" },
          { label: "Finance", val: data.financeCount, icon: <FiDollarSign />, color: "purple" },
          { label: "Contract", val: data.contractCount, icon: <FiFileText />, color: "indigo" },
          { label: "Installation", val: data.installationCount, icon: <FiTool />, color: "green" },
          { label: "Completed", val: data.completedCount, icon: <FiCheckCircle />, color: "teal" },
        ].map((item, idx) => (
          <div key={idx} className={`statCard`}>
            <div className="cardHeaderRow">
              <div className={`iconCircle ${item.color}Circle`}>
                {item.icon}
              </div>
              <h4>{item.label}</h4>
            </div>
            <p>{item.val}</p>
          </div>
        ))}
      </div>

 <div className="financeSummary">
        <div>
          <h4>Finance Volume</h4>
          <p>₹{data.totalFinanceAmount.toLocaleString()}</p>
        </div>
        <div style={{ width: '1px', background: '#e2e8f0', height: '50px' }}></div>
        <div>
          <h4>Installation Expenses</h4>
          <p>₹{data.totalInstallationExpense.toLocaleString()}</p>
        </div>
      </div>

<div className="dashboardBottom">
        <div className="chartCard" style={{ background: '#fff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Revenue Overview</h3>
          <RevenueChart />
        </div>

<div className="leaderboardCard">
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Top Performers</h3>
          {leaderboard.length === 0 ? (
            <p className="neutralText">No sales data available</p>
          ) : (
            leaderboard.map((user, index) => (
              <div key={index} className="leaderRow">
                <span className="rank">{index + 1}</span>
                <span className="leaderName" style={{ fontWeight: '600', color: '#334155' }}>{user.username}</span>
                <span className="leaderDeals" style={{ fontSize: '13px', margin: '0 15px' }}>{user.completedDeals} deals</span>
                <span className="leaderRevenue">₹{user.totalRevenue.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
</div>


      {showFollowUpModal && (
        <div className="followUpOverlay" onClick={()=>setShowFollowUpModal(false)}>
        <div className="followUpModal" onClick={(e)=>e.stopPropagation()}>
          <div className="followUpContent">
            <h3 style={{ fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>{followUpTitle}</h3>
            <div style={{ marginTop: '20px' }}>
              {followUpList.length === 0 ? <p>No follow-ups</p> : 
           followUpList.map(f => (
  <div key={f.id} className="followUpItem">

    <strong>{f.customer?.name}</strong>

    <p>{f.notes}</p>

    <small>
      {new Date(f.followUpDate).toLocaleString()}
    </small>

    <button
      className="markDoneBtn"
      onClick={() => markDone(f.id)}
    >
      Mark Done
    </button>

  </div>
))}
            </div>
            <button className="closeBtn" onClick={() => setShowFollowUpModal(false)}>Close Window</button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;