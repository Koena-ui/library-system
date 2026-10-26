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

// onSubmit(data) returns a promise that resolves to an error message, or null on success.
export default function UserForm({ users, editingUser, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editingUser ? { ...editingUser } : EMPTY);
    setErrors({});
    setSubmitError("");
  }, [editingUser]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form, users, editingUser?.id);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    const serverError = await onSubmit({ name: form.name.trim(), membershipId: form.membershipId.trim(), role: form.role });
    setSaving(false);
    setSubmitError(serverError || "");
    if (!serverError) setForm(EMPTY);
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
      {submitError && <p className="error" role="alert">{submitError}</p>}
      <div className="btn-row">
        <button type="submit" disabled={saving}>{saving ? "Saving..." : editingUser ? "Save Changes" : "Add User"}</button>
        {editingUser && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
