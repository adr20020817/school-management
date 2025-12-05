// src/components/layout/Layout.jsx
import React, { useState } from "react";
import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const { Content } = AntLayout;

const Layout = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        toggleMobile={toggleMobile}
        userRole={userRole}
      />

      <AntLayout className="site-layout">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Content style={{ margin: "24px", backgroundColor: "#f9f9f9", minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
