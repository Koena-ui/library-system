import { useState, useEffect } from "react";
import FormField from "./FormField";

const EMPTY = { name: "", membershipId: "", role: "Member" };

function validate(f, users, editingId) {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
  if (!f.membershipId.trim()) e.membershipId = "Membership ID is required.";
  else if (users.some((u) => u.membershipId.toLowerCase() === f.membershipId.trim().toLowerCase() && u.id !== editingId))
    e.membershipId = "This membership ID is already taken.";
  return e;
}

// onSubmit(data) may return an error string to display on the role field.
export default function UserForm({ users, editingUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editingUser ? { ...editingUser } : EMPTY);
    setErrors({});
  }, [editingUser]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form, users, editingUser?.id);
    setErrors(found);
    if (Object.keys(found).length) return;
    const err = onSubmit({ name: form.name.trim(), membershipId: form.membershipId.trim(), role: form.role });
    if (err) return setErrors({ role: err });
    setForm(EMPTY);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>{editingUser ? "Update User" : "Add New User"}</h2>
      <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
      <FormField label="Membership ID" name="membershipId" value={form.membershipId}
        onChange={handleChange} error={errors.membershipId} />
      <FormField as="select" label="Role" name="role" value={form.role} onChange={handleChange} error={errors.role}>
        <option value="Member">Member</option>
        <option value="Librarian">Librarian</option>
      </FormField>
      <div className="btn-row">
        <button type="submit">{editingUser ? "Save Changes" : "Add User"}</button>
        {editingUser && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
