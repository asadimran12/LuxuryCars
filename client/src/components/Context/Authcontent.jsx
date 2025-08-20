import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [role,setrole]=useState(()=>localStorage.getItem("role") || "");

  const login = (newToken,newrole) => {
    setToken(newToken);
    setrole(newrole)
    localStorage.setItem("token", newToken);
    localStorage.setItem("role",newrole);
  };

  const logout = () => {
    setToken("");
    setrole("")
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
