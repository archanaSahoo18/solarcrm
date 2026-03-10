import "./navbar.css";

function Navbar({ role, onLogout, onUsers, onCreateUser, onAddCustomer }) {
  return (
    <div className="navbar">

      <div className="navbarLogo">
        Solar CRM
      </div>

      <div className="navbarActions">

        {role === "ADMIN" && (
          <>
            <button onClick={onCreateUser} className="navButton">
              Create User
            </button>

            <button onClick={onUsers} className="navButton">
              Users
            </button>
          </>
        )}

        <button onClick={onAddCustomer} className="navButton primaryButton">
          + Add Customer
        </button>

        <button onClick={onLogout} className="navButton">
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;