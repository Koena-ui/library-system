import { useState } from "react";
import FormField from "./FormField";

export default function LoginForm({ onLogin }) {
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id.trim()) return setError("Membership ID is required.");
    if (!onLogin(id)) return setError("Membership ID not found.");
    setError("");
    setId("");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>User Login</h2>
      <FormField label="Membership ID" name="loginId" value={id}
        onChange={(e) => setId(e.target.value)} error={error} />
      <button type="submit">Login</button>
    </form>
  );
}
