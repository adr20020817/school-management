// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Badge, Modal, List, Button, Spin } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import logo from "/src/assets/images/Logo.png";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user, logout } = useAuth();
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);

  // Wait until user is loaded from context/localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) setLoadingUser(false);
  }, [user]);

  // Load notifications for students
  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchNotifications = () => {
      const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      const userNotifs = allNotifications.filter(
        (n) => !n.read && (!n.targetRoles || n.targetRoles.includes("student"))
      );
      setNotifications(userNotifs);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Show empty header while loading
  if (loadingUser) return <AntHeader style={{ height: 64, backgroundColor: "#f0f2f5" }} />;

  // Role-based theme
  const roleThemes = {
    admin: { bg: "#0B3D91", text: "#FFD700", avatarBg: "#FFD700", avatarColor: "#0B3D91" },
    teacher: { bg: "#FFD700", text: "#0B3D91", avatarBg: "#0B3D91", avatarColor: "#FFD700" },
    student: { bg: "#FFFFFF", text: "#0B3D91", avatarBg: "#0B3D91", avatarColor: "#FFFFFF" },
    parent: { bg: "#f0f2f5", text: "#0B3D91", avatarBg: "#0B3D91", avatarColor: "#FFFFFF" },
    finance: { bg: "#0B3D91", text: "#FFD700", avatarBg: "#FFD700", avatarColor: "#0B3D91" },
  };
  const theme = roleThemes[user.role] || roleThemes["student"];

  // User dropdown menu
  const userMenu = {
    items: [
      { key: "profile", label: "Profile", onClick: () => setProfileVisible(true) },
      { key: "logout", label: "Logout", onClick: logout },
    ],
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (notifId) => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updated = allNotifications.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated.filter((n) => !n.read && (!n.targetRoles || n.targetRoles.includes("student"))));
  };

  return (
    <>
      <AntHeader
        style={{
          backgroundColor: theme.bg,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Left: Logo + App Name + Role */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span style={{ color: theme.text, fontWeight: "bold", fontSize: 20 }}>ElimuSphere</span>
          <span style={{ color: theme.text, fontSize: 14, marginLeft: 10 }}>
            ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
          </span>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-4">
          {user.role === "student" && (
            <Badge count={unreadCount}>
              <BellOutlined
                style={{ fontSize: 22, color: "#FFD700", cursor: "pointer" }}
                onClick={() => setNotifVisible(true)}
              />
            </Badge>
          )}
          <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ cursor: "pointer", backgroundColor: theme.avatarBg, color: theme.avatarColor }}
            />
          </Dropdown>
        </div>
      </AntHeader>

      {/* Profile Modal */}
      <Modal
        title="Profile Information"
        open={isProfileVisible}
        onCancel={() => setProfileVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setProfileVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {user ? (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            {user.regNo && <p><strong>Reg No:</strong> {user.regNo}</p>}
          </div>
        ) : (
          <Spin />
        )}
      </Modal>

      {/* Notifications Modal */}
      {user.role === "student" && (
        <Modal
          title="Notifications"
          open={isNotifVisible}
          onCancel={() => setNotifVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setNotifVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {notifications.length > 0 ? (
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  style={{
                    backgroundColor: item.read ? "#f9f9f9" : "#FFF9E6",
                    borderRadius: 4,
                    marginBottom: 6,
                    padding: "10px 16px",
                  }}
                  actions={[
                    !item.read && (
                      <Button size="small" type="link" onClick={() => markAsRead(item.id)}>
                        Mark as Read
                      </Button>
                    ),
                  ]}
                >
                  <List.Item.Meta
                    title={<span style={{ color: "#0B3D91" }}>{item.title}</span>}
                    description={item.message}
                  />
                </List.Item>
              )}
            />
          ) : (
            <p className="text-gray-500">No notifications yet.</p>
          )}
        </Modal>
      )}
    </>
  );
};

export default Header;
