import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layout
import Layout from "../components/layout/Layout";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageStudents from "../pages/admin/ManageStudents";
import ManageTeachers from "../pages/admin/ManageTeachers";
import ManageParents from "../pages/admin/ManageParents";
import AdminLogin from "../pages/admin/AdminLogin";
import Reports from "../pages/admin/Reports";
import Notifications from "../pages/admin/Notifications";


// Teacher Pages
import TeacherDashboard from "../pages/teacher/TeacherDashboard";

// Finance Pages
import FinanceDashboard from "../pages/finance/FinanceDashboard";

// Parent Pages
import ParentDashboard from "../pages/parent/ParentDashboard";

// Student Pages
import StudentDashboard from "../pages/students/StudentDashboard";
import StudentProfile from "../pages/students/StudentProfile";
import Attendance from "../pages/students/Attendance";
import AcademicProgress from "../pages/students/AcademicProgress";
import Fees from "../pages/students/Fees";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// ------------------- Private Route -------------------
const PrivateRoute = ({ allowedRoles, adminLogin }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect admins to /admin-login, others to /login
    if (adminLogin) return <Navigate to="/admin-login" />;
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Unauthorized role, redirect to home based on role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" />;
      case "teacher":
        return <Navigate to="/teacher" />;
      case "finance":
        return <Navigate to="/finance" />;
      case "parent":
        return <Navigate to="/parent" />;
      case "student":
        return <Navigate to="/student" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
};

// ------------------- Routes -------------------
const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<PrivateRoute allowedRoles={["admin"]} adminLogin />}>
        <Route element={<Layout userRole="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-teachers" element={<ManageTeachers />} />
          <Route path="manage-parents" element={<ManageParents />} />
          <Route path="reports" element={<Reports />} />   
          <Route path="notifications" element={<Notifications />} /> 
        </Route>
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher/*" element={<PrivateRoute allowedRoles={["teacher"]} />}>
        <Route element={<Layout userRole="teacher" />}>
          <Route index element={<TeacherDashboard />} />
        </Route>
      </Route>

      {/* Finance Routes */}
      <Route path="/finance/*" element={<PrivateRoute allowedRoles={["finance"]} />}>
        <Route element={<Layout userRole="finance" />}>
          <Route index element={<FinanceDashboard />} />
        </Route>
      </Route>

      {/* Parent Routes */}
      <Route path="/parent/*" element={<PrivateRoute allowedRoles={["parent"]} />}>
        <Route element={<Layout userRole="parent" />}>
          <Route index element={<ParentDashboard />} />
        </Route>
      </Route>

      {/* Student Routes */}
      <Route path="/student/*" element={<PrivateRoute allowedRoles={["student"]} />}>
        <Route element={<Layout userRole="student" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="academic" element={<AcademicProgress />} />
          <Route path="fees" element={<Fees />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={<h1 className="p-6 text-3xl text-center text-blue-900">404 - Page Not Found</h1>}
      />
    </Routes>
  );
};

export default AppRoutes;
