import { useEffect, useState } from "react";
import api from "../api/api";
import { FiBell } from "react-icons/fi";
import "./notificationBell.css";

function NotificationBell() {

  const [notifications,setNotifications] = useState([]);
  const [count,setCount] = useState(0);
  const [open,setOpen] = useState(false);

  const loadNotifications = async () => {

    const list = await api.get("/notifications");
    const unread = await api.get("/notifications/unread-count");

    setNotifications(list.data);
    setCount(unread.data);
  };

  useEffect(()=>{

    loadNotifications();

    const interval = setInterval(loadNotifications,30000);

    return ()=>clearInterval(interval);

  },[]);

  return (
    <div className="notificationWrapper">

      <button onClick={()=>setOpen(!open)} className="bellBtn">
        <FiBell size={20}/>
        {count>0 && <span className="badge">{count}</span>}
      </button>

      {open && (
        <div className="dropdown">
          {notifications.map(n=>(
            <div key={n.id} className="notificationItem">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default NotificationBell;