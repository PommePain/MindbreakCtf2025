import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../utils/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("ProtectedRoute must be used within an AuthProvider");
  }

  const { authUser, isLoading } = context;

  if (isLoading) {
    return null;
  }

  if (!authUser) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
