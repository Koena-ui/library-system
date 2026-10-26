import { useState } from "react";
import FormField from "./FormField";

// onLogin(membershipId) returns a promise: an error message, or null on success.
export default function LoginForm({ onLogin }) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id.trim()) return setError("Membership ID is required.");
    setBusy(true);
    const err = await onLogin(id);
    setBusy(false);
    if (err) return setError(err);
    setError("");
    setId("");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>User Login</h2>
      <FormField label="Membership ID" name="loginId" value={id}
        onChange={(e) => setId(e.target.value)} error={error} />
      <button type="submit" disabled={busy}>{busy ? "Checking..." : "Login"}</button>
    </form>
  );
}
