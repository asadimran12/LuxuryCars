import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/Authcontent";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { token, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/login" />;

  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
