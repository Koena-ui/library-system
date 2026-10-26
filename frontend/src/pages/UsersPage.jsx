import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/LoginForm";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";
import usePageTitle from "../hooks/usePageTitle";

export default function UsersPage() {
  usePageTitle("User Management");
  const { users, addUser, updateUser, deleteUser } = useLibrary();
  const { currentUser, isLibrarian, login } = useAuth();
  const [editing, setEditing] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from;

  const librarianCount = users.filter((u) => u.role === "Librarian").length;

  const handleLogin = async (membershipId) => {
    const { user, error } = await login(membershipId);
    if (user && from && user.role === "Librarian") navigate(from, { replace: true });
    return error || null;
  };

  // Returns an error message (shown in the form) or null on success.
  const handleSubmit = async (data) => {
    if (!editing) return addUser(data);
    const err = await updateUser(editing.id, data);
    if (!err) setEditing(null);
    return err;
  };

  const handleDelete = async (user) => {
    if (user.id === currentUser?.id) return alert("You cannot delete the account you are logged in with.");
    if (user.role === "Librarian" && librarianCount === 1) return alert("You cannot delete the last librarian.");
    if (!window.confirm(`Delete ${user.name}?`)) return;
    const err = await deleteUser(user.id);
    if (err) return alert(err);
    if (editing?.id === user.id) setEditing(null);
  };

  return (
    <section>
      {from && !isLibrarian && <p className="error">Please log in as a librarian to open that page.</p>}
      {currentUser ? (
        <p className="success">Welcome, {currentUser.name} ({currentUser.role}).</p>
      ) : (
        <>
          <LoginForm onLogin={handleLogin} />
          <p className="muted">First time? Log in with the default librarian ID: <strong>LIB001</strong></p>
        </>
      )}

      {isLibrarian && (
        <>
          <hr />
          <h2>Admin: Manage Users</h2>
          <UserForm users={users} editingUser={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />
          <h3>Registered Users</h3>
          <UserList users={users} onEdit={setEditing} onDelete={handleDelete} />
        </>
      )}
    </section>
  );
}
