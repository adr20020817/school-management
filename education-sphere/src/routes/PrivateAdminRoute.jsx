// src/routes/PrivateAdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const SECRET_ADMIN_KEY = "ADMIN-KEY-999";

const PrivateAdminRoute = () => {
  const key = localStorage.getItem("adminKey");

  if (key !== SECRET_ADMIN_KEY) {
    // Not authorized → redirect to secret login
    return <Navigate to="/admin-login" replace />;
  }

  // Authorized → render nested routes
  return <Outlet />;
};

export default PrivateAdminRoute;
