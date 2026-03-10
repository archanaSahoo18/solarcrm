import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./users.css";
import { FiArrowLeft, FiTrash2, FiShield, FiUser } from "react-icons/fi"; // Added icons
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
const navigate = useNavigate(); // Initialize the hook



  const fetchUsers = () => {
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => {
        Swal.fire({
          icon: "error",
          title: "Access denied",
          text: err.response?.data?.message || "Only admin can view users"
        });
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete user"
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/users/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "User has been removed.", "success");
            fetchUsers();
          })
          .catch(() => {
            Swal.fire("Error", "Could not delete user", "error");
          });
      }
    });
  };

  return (
    <div className="usersPage">
      <div className="usersHeader">
        <div>
          <h2>User Management</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 0 0" }}>
            Review and manage system access levels
          </p>
        </div>
        <button className="backBtn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
      </div>

      <div className="usersTableWrap">
        <table className="usersTable">
          <thead>
            <tr>
              <th>User Details</th>
              <th>Role</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ 
                      width: "35px", height: "35px", borderRadius: "50%", 
                      background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#64748b"
                    }}>
                      <FiUser />
                    </div>
                    <div>
                      <div style={{ fontWeight: "600" }}>{u.username}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>ID: #{u.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`roleBadge ${u.role.toLowerCase()}`}>
                    {u.role === "ADMIN" ? <FiShield style={{marginRight: '4px'}} /> : null}
                    {u.role}
                  </span>
                </td>
                <td>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}></span>
                    Active
                  </span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <button className="dangerBtn" onClick={() => deleteUser(u.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  No users found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}