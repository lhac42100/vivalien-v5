import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthChange, login as authLogin, logout as authLogout } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((userData) => {
      setUser(userData);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const userData = await authLogin(email, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
