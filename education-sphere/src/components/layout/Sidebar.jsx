// src/components/layout/Sidebar.jsx
import React from "react";
import { Menu, Layout, Drawer } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined,
  DollarOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileChartColumn } from "lucide-react";
import logo from "/src/assets/images/Logo.png";
import { useAuth } from "../../context/AuthContext";

const { Sider } = Layout;

const Sidebar = ({ collapsed, toggleCollapsed, mobileOpen, toggleMobile, userRole }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Only show admin links if logged in as admin
  const isAdmin = user && user.role === "admin";

  const menusByRole = {
    admin: isAdmin
      ? [
          { key: "/admin", icon: <LayoutDashboard />, label: "Dashboard" },
          { key: "/admin/manage-students", icon: <UserOutlined />, label: "Manage Students" },
          { key: "/admin/manage-teachers", icon: <BookOutlined />, label: "Manage Teachers" },
          { key: "/admin/manage-parents", icon: <UserOutlined />, label: "Manage Parents" },
          { key: "/admin/reports", icon: <FileChartColumn />, label: "Reports" },
          { key: "/admin/notifications", icon: <BellOutlined />, label: "Notifications" },
        ]
      : [],
    teacher: [{ key: "/teacher", icon: <BookOutlined />, label: "Dashboard" }],
    finance: [{ key: "/finance", icon: <DollarOutlined />, label: "Dashboard" }],
    parent: [{ key: "/parent", icon: <UserOutlined />, label: "Dashboard" }],
    student: [
      { key: "/student", icon: <HomeOutlined />, label: "Dashboard" },
      { key: "/student/profile", icon: <UserOutlined />, label: "Profile" },
      { key: "/student/attendance", icon: <CalendarOutlined />, label: "Attendance" },
      { key: "/student/academic", icon: <BookOutlined />, label: "Academics" },
      { key: "/student/fees", icon: <DollarOutlined />, label: "Fees" },
    ],
  };

  const menuItems = menusByRole[userRole] || [];

  const menu = (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ backgroundColor: "#FFFFFF", border: "none", flex: 1 }}
      items={menuItems.map((item) => ({
        key: item.key,
        icon: React.cloneElement(item.icon, { style: { color: "#0B3D91" } }),
        label: (
          <Link
            to={item.key}
            onClick={() => mobileOpen && toggleMobile()}
            style={{ color: "#0B3D91", transition: "all 0.2s ease" }}
            className="sidebar-link"
          >
            {item.label}
          </Link>
        ),
      }))}
    />
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        width={250}
        collapsedWidth={80}
        breakpoint="md"
        style={{ backgroundColor: "#FFFFFF", minHeight: "100vh" }}
      >
        <div
          className="flex items-center justify-center p-4 border-b"
          style={{ borderColor: "#E5E7EB" }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-10 h-10 mr-2 object-contain"
            style={{ display: collapsed ? "none" : "block" }}
          />
          <span className="text-xl font-bold" style={{ color: "#0B3D91" }}>
            {collapsed ? "ES" : "ElimuSphere"}
          </span>
        </div>
        {menu}
      </Sider>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold" style={{ color: "#0B3D91" }}>
              ElimuSphere
            </span>
          </div>
        }
        placement="left"
        closable={true}
        onClose={toggleMobile}
        open={mobileOpen}
        bodyStyle={{ padding: 0, backgroundColor: "#FFFFFF" }}
        width={250}
      >
        {menu}
      </Drawer>

      {/* Custom CSS */}
      <style>
        {`
          .sidebar-link:hover {
            color: #FFD700 !important;
          }
          .ant-menu-item:hover {
            background-color: rgba(255, 215, 0, 0.1) !important;
          }
          .ant-menu-item-selected {
            background-color: rgba(255, 215, 0, 0.2) !important;
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;
