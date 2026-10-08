import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, isLibrarian, logout } = useAuth();
  return (
    <header className="site-header">
      <h1>HLOPHEHO COMMUNITY LIBRARY</h1>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        {isLibrarian && <NavLink to="/books">Manage Books</NavLink>}
        {isLibrarian && <NavLink to="/transactions">Transactions</NavLink>}
        <NavLink to="/users">User Management</NavLink>
        {currentUser && (
          <span className="session">
            {currentUser.name} ({currentUser.role}) <button onClick={logout}>Logout</button>
          </span>
        )}
      </nav>
    </header>
  );
}
