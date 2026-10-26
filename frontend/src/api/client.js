// All communication with the Express backend goes through this file (Fetch API).
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }

  if (response.status === 204) return null; // successful delete, no content
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || `Request failed (${response.status}).`);
  return data;
}

export const booksApi = {
  list: () => request("/books"),
  create: (book) => request("/books", { method: "POST", body: book }),
  update: (id, book) => request(`/books/${id}`, { method: "PUT", body: book }),
  remove: (id) => request(`/books/${id}`, { method: "DELETE" }),
};

export const usersApi = {
  list: () => request("/users"),
  create: (user) => request("/users", { method: "POST", body: user }),
  update: (id, user) => request(`/users/${id}`, { method: "PUT", body: user }),
  remove: (id) => request(`/users/${id}`, { method: "DELETE" }),
  login: (membershipId) => request("/users/login", { method: "POST", body: { membershipId } }),
};

export const transactionsApi = {
  list: () => request("/transactions"),
  create: (transaction) => request("/transactions", { method: "POST", body: transaction }),
};
