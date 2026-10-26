import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { booksApi, usersApi, transactionsApi } from "../api/client";

const LibraryContext = createContext(null);
export const useLibrary = () => useContext(LibraryContext);

// Runs an async action and returns an error message, or null when it succeeded.
async function attempt(action) {
  try {
    await action();
    return null;
  } catch (err) {
    return err.message;
  }
}

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false); // true after the first successful load
  const [error, setError] = useState("");

  // Load everything from the API (on first render, and when "Retry" is clicked).
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [b, u, t] = await Promise.all([booksApi.list(), usersApi.list(), transactionsApi.list()]);
      setBooks(b);
      setUsers(u);
      setLogs(t);
      setError("");
      setLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ----- books -----
  const addBook = (data) =>
    attempt(async () => {
      const created = await booksApi.create(data);
      setBooks((prev) => [...prev, created]);
    });

  const updateBook = (id, data) =>
    attempt(async () => {
      const updated = await booksApi.update(id, data);
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    });

  const deleteBook = (id) =>
    attempt(async () => {
      await booksApi.remove(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    });

  // ----- transactions -----
  const processTransaction = (data) =>
    attempt(async () => {
      const { transaction, book } = await transactionsApi.create(data);
      setBooks((prev) => prev.map((b) => (b.id === book.id ? book : b)));
      setLogs((prev) => [transaction, ...prev]);
    });

  // ----- users -----
  const addUser = (data) =>
    attempt(async () => {
      const created = await usersApi.create(data);
      setUsers((prev) => [...prev, created]);
    });

  const updateUser = (id, data) =>
    attempt(async () => {
      const updated = await usersApi.update(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    });

  const deleteUser = (id) =>
    attempt(async () => {
      await usersApi.remove(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    });

  const value = {
    books, users, logs, loading, loaded, error, reload: load,
    addBook, updateBook, deleteBook,
    processTransaction,
    addUser, updateUser, deleteUser,
  };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
