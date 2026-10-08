import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const LibraryContext = createContext(null);
export const useLibrary = () => useContext(LibraryContext);

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const SEED_USERS = [{ id: uid(), name: "Head Librarian", membershipId: "LIB001", role: "Librarian" }];

export function LibraryProvider({ children }) {
  const [books, setBooks] = useLocalStorage("library:books", []);
  const [users, setUsers] = useLocalStorage("library:users", SEED_USERS);
  const [logs, setLogs] = useLocalStorage("library:logs", []);

  const addBook = (book) => setBooks((prev) => [...prev, { ...book, id: uid() }]);
  const updateBook = (id, data) => setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  const deleteBook = (id) => setBooks((prev) => prev.filter((b) => b.id !== id));

  const processTransaction = ({ bookId, type, qty, by }) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return "Book not found.";
    if (type === "deduct" && book.qty < qty) return `Insufficient stock: only ${book.qty} available.`;
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, qty: type === "add" ? b.qty + qty : b.qty - qty } : b))
    );
    setLogs((prev) => [
      { id: uid(), bookTitle: book.title, type, qty, by, date: new Date().toISOString() },
      ...prev,
    ]);
    return null;
  };

  const addUser = (user) => setUsers((prev) => [...prev, { ...user, id: uid() }]);
  const updateUser = (id, data) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const value = {
    books, users, logs,
    addBook, updateBook, deleteBook,
    processTransaction,
    addUser, updateUser, deleteUser,
  };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}
