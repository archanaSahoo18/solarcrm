import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom"; // Added useLocation
import "./layout.css";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Determine if we are on the register page to apply centering logic
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className={`mainContent ${collapsed ? "collapsed" : ""}`}>
        {/* If on register page, use 'centeringWrapper' to remove the white box 
          and center the card. Otherwise, use 'pageWrapper'.
        */}
        <div className={isRegisterPage ? "centeringWrapper" : "pageWrapper"}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;