import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import BooksPage from "./pages/BooksPage";
import TransactionsPage from "./pages/TransactionsPage";
import UsersPage from "./pages/UsersPage";
import { useLibrary } from "./context/LibraryContext";

export default function App() {
  const { loading, loaded, error, reload } = useLibrary();

  return (
    <>
      <Navbar />
      <main className="container">
        {error && (
          <div className="banner" role="alert">
            <span>{error}</span>
            <button onClick={reload}>Retry</button>
          </div>
        )}
        {loading && !loaded ? (
          <p className="empty">Loading library data...</p>
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </>
  );
}
