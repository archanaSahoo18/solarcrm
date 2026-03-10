import { useEffect, useState } from "react";
import api from "../api/api";
import Swal from "sweetalert2";
import "./assignModal.css";

export default function AssignLeadModal({ customerId, onClose, onSuccess }) {

  const [users,setUsers] = useState([]);
  const [selectedUser,setSelectedUser] = useState("");
  const [loading,setLoading] = useState(false);
  

  const fetchUsers = async () => {
    try{

      const res = await api.get("/users");

      setUsers(res.data);

    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchUsers();
  },[]);

  const handleAssign = async () => {

    if(!selectedUser){
      Swal.fire("Select user first");
      return;
    }

    try{

      setLoading(true);

      await api.put(`/customers/${customerId}/assign/${selectedUser}`);

      Swal.fire({
        icon:"success",
        title:"Lead Assigned",
        timer:1200,
        showConfirmButton:false
      });

      onSuccess();

    }catch(err){

      Swal.fire({
        icon:"error",
        title:"Failed",
        text:err.response?.data?.message || "Assignment failed"
      });

    }finally{
      setLoading(false);
    }
  };

  return (

    <div className="assignOverlay">

      <div className="assignCard">

        <h3>Assign Lead</h3>

        <select
          value={selectedUser}
          onChange={(e)=>setSelectedUser(e.target.value)}
        >

          <option value="">Select User</option>

          {users.map(u=>(
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}

        </select>

        <div className="assignActions">

          <button
            className="btnCancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btnAssign"
            onClick={handleAssign}
            disabled={loading}
          >
            {loading ? "Assigning..." : "Assign Lead"}
          </button>

        </div>

      </div>

    </div>
  );
}