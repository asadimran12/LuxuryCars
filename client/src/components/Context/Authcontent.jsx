import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");

  const login = (newToken, newRole, newUserId) => {
    setToken(newToken);
    setRole(newRole);
    setUserId(newUserId);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userId", newUserId);
  };

  const logout = () => {
    setToken("");
    setRole("");
    setUserId("");

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ role, token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
