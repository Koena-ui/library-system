import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLibrarian } = useAuth();
  const location = useLocation();
  return isLibrarian ? children : <Navigate to="/users" replace state={{ from: location.pathname }} />;
}
