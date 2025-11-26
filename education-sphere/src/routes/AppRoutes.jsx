import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";
import PrivateRoute from "./PrivateRoute";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";

// Teacher
import TeacherDashboard from "../pages/teacher/TeacherDashboard";

// Finance
import FinanceDashboard from "../pages/finance/FinanceDashboard";

// Parent
import ParentDashboard from "../pages/parent/ParentDashboard";

// Student
import StudentDashboard from "../pages/students/StudentDashboard";
import StudentProfile from "../pages/students/StudentProfile";
import Attendance from "../pages/students/Attendance";
import AcademicProgress from "../pages/students/AcademicProgress";
import Fees from "../pages/students/Fees";

// Auth
import Login from "../pages/auth/Login";
import RegisterStudent from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterStudent />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <Layout userRole="admin" />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Teacher */}
      <Route
        path="/teacher"
        element={
          <PrivateRoute allowedRoles={["teacher"]}>
            <Layout userRole="teacher" />
          </PrivateRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
      </Route>

      {/* Finance */}
      <Route
        path="/finance"
        element={
          <PrivateRoute allowedRoles={["finance"]}>
            <Layout userRole="finance" />
          </PrivateRoute>
        }
      >
        <Route index element={<FinanceDashboard />} />
      </Route>

      {/* Parent */}
      <Route
        path="/parent"
        element={
          <PrivateRoute allowedRoles={["parent"]}>
            <Layout userRole="parent" />
          </PrivateRoute>
        }
      >
        <Route index element={<ParentDashboard />} />
      </Route>

      {/* Student */}
      <Route
        path="/student"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <Layout userRole="student" />
          </PrivateRoute>
        }
      >
        {/* Nested Student Pages */}
        <Route index element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="academic" element={<AcademicProgress />} />
        <Route path="fees" element={<Fees />} />
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <h1 className="p-6 text-3xl text-center" style={{ color: "#0B3D91" }}>
            404 - Page Not Found
          </h1>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
