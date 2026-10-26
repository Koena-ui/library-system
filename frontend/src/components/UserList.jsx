export default function UserList({ users, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="responsive-table">
        <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td data-label="Name">{u.name}</td>
              <td data-label="Membership ID">{u.membershipId}</td>
              <td data-label="Role">{u.role}</td>
              <td data-label="Actions" className="actions">
                <button onClick={() => onEdit(u)}>Update</button>
                <button className="danger" onClick={() => onDelete(u)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
