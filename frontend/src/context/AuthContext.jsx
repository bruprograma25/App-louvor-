import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  async function login({ email, password }) {
    const response = await api.post("/login", { email, password });
    const { token, user: userData } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(userData);

    return userData;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, logout, setUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
