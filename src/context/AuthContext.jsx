import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useLibrary } from "./LibraryContext";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const { users } = useLibrary();
  const [sessionId, setSessionId] = useLocalStorage("library:session", null);

  const currentUser = users.find((u) => u.id === sessionId) || null;
  const isLibrarian = currentUser?.role === "Librarian";

  const login = (membershipId) => {
    const user = users.find((u) => u.membershipId.toLowerCase() === membershipId.trim().toLowerCase());
    if (user) setSessionId(user.id);
    return user || null;
  };
  const logout = () => setSessionId(null);

  return (
    <AuthContext.Provider value={{ currentUser, isLibrarian, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
