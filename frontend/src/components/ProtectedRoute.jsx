import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Only librarians may open the wrapped page; others are sent to the login page.
export default function ProtectedRoute({ children }) {
  const { isLibrarian } = useAuth();
  const location = useLocation();
  return isLibrarian ? children : <Navigate to="/users" replace state={{ from: location.pathname }} />;
}
