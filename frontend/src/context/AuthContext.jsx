import { createContext, useContext, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { usersApi } from "../api/client";
import { useLibrary } from "./LibraryContext";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const { users, loaded } = useLibrary();
  // Only the logged-in user is kept in the browser; all other data lives in the database.
  const [currentUser, setCurrentUser] = useLocalStorage("library:session", null);
  const isLibrarian = currentUser?.role === "Librarian";

  // Keep the session in step with the database: log out if the user was deleted,
  // and pick up changes to their name or role.
  useEffect(() => {
    if (!loaded || !currentUser) return;
    const fresh = users.find((u) => u.id === currentUser.id);
    if (!fresh) setCurrentUser(null);
    else if (JSON.stringify(fresh) !== JSON.stringify(currentUser)) setCurrentUser(fresh);
  }, [users, loaded, currentUser, setCurrentUser]);

  // Returns { user } on success or { error } on failure.
  const login = async (membershipId) => {
    try {
      const user = await usersApi.login(membershipId.trim());
      setCurrentUser(user);
      return { user };
    } catch (err) {
      return { error: err.message };
    }
  };
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, isLibrarian, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
