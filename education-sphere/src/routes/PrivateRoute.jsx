import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles, adminLogin }) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    // Redirect admin to /admin-login if specified
    if (adminLogin) return <Navigate to="/admin-login" replace />;
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <h1 className="p-6 text-3xl text-center" style={{ color: "#0B3D91" }}>
        403 - Unauthorized
      </h1>
    );
  }

  // If logged in and allowed, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
