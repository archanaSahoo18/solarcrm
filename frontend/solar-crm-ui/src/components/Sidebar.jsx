import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiPlusCircle,
  FiLogOut,
  FiMenu,
  FiGitBranch,
  FiChevronLeft
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
      {/* Brand Logo Section */}
      <div className="sidebarTop">
        <div className="logoWrapper">
          <div className="logoCircle">☀️</div>
          {!collapsed && <span className="sidebarTitle">Solar CRM</span>}
        </div>
        <button
          className="collapseBtn"
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle sidebar"
        >
          {collapsed ? <FiMenu /> : <FiChevronLeft />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebarMenu">
        <small className="menuLabel">{!collapsed && "Main Menu"}</small>
        
        <NavLink to="/dashboard" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
          <FiHome className="navIcon" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/pipeline" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
          <FiGitBranch className="navIcon" />
          {!collapsed && <span>Pipeline</span>}
        </NavLink>

        {role === "ADMIN" && (
          <>
            <small className="menuLabel">{!collapsed && "Administration"}</small>
            <NavLink to="/users" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
              <FiUsers className="navIcon" />
              {!collapsed && <span>Users</span>}
            </NavLink>

            <NavLink to="/register" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
              <FiUserPlus className="navIcon" />
              {!collapsed && <span>Create User</span>}
            </NavLink>
          </>
        )}

        <small className="menuLabel">{!collapsed && "Actions"}</small>
        <NavLink to="/add-customer" className={({ isActive }) => `sidebarItem ${isActive ? "active" : ""}`}>
          <FiPlusCircle className="navIcon" />
          {!collapsed && <span>Add Customer</span>}
        </NavLink>
      </nav>

      {/* User Footer Section */}
      <div className="sidebarFooter">
        <div className="userBrief">
           <div className="avatar">{role?.charAt(0) || "U"}</div>
           {!collapsed && (
             <div className="userText">
               <p className="userName">System {role}</p>
               <p className="userStatus">Online</p>
             </div>
           )}
        </div>
        <button onClick={handleLogout} className="logoutBtn" title="Logout">
          <FiLogOut />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;