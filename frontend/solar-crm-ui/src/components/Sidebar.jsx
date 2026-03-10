import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiPlusCircle,
  FiLogOut,
  FiMenu,
  FiGitBranch 
} from "react-icons/fi";
import "./sidebar.css";

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top row */}
      <div className="sidebarTop">
        <button
          className="collapseBtn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <FiMenu />
        </button>

        {!collapsed && <div className="sidebarTitle">Solar CRM</div>}
      </div>

      {/* Menu */}
      <nav className="sidebarMenu">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
          <span className="iconWrap"><FiHome /></span>
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/pipeline" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
          <span className="iconWrap"><FiGitBranch /></span>
          {!collapsed && <span>Pipeline</span>}
        </NavLink>

        {role === "ADMIN" && (
          <>
            <NavLink to="/users" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
              <span className="iconWrap"><FiUsers /></span>
              {!collapsed && <span>Users</span>}
            </NavLink>

            <NavLink to="/register" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
              <span className="iconWrap"><FiUserPlus /></span>
              {!collapsed && <span>Create User</span>}
            </NavLink>
          </>
        )}

        <NavLink to="/add-customer" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
          <span className="iconWrap"><FiPlusCircle /></span>
          {!collapsed && <span>Add Customer</span>}
        </NavLink>
      </nav>

      {/* Footer (always visible) */}
      <div className="sidebarFooter">
        <button onClick={handleLogout} className="logoutBtn" title="Logout">
          <span className="iconWrap"><FiLogOut /></span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;