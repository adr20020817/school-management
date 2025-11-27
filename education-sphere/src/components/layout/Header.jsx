import React, { useState, useEffect } from "react";
import { Layout, Avatar, Dropdown, Badge, Modal, List, Button } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import logo from "/src/assets/images/Logo.png";

const { Header: AntHeader } = Layout;

const Header = () => {
  const { user, logout } = useAuth();
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage
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

  const userMenu = {
    items: [
      { key: "profile", label: "Profile", onClick: () => setProfileVisible(true) },
      { key: "logout", label: "Logout", onClick: logout },
    ],
  };

  const markAsRead = (notifId) => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const updated = allNotifications.map((n) => (n.id === notifId ? { ...n, read: true } : n));
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated.filter((n) => !n.read && (!n.targetRoles || n.targetRoles.includes("student"))));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <AntHeader
        style={{
          backgroundColor: "#FFFFFF", // match sidebar & dashboard
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold" style={{ color: "#0B3D91" }}>
            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "School Management System"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user?.role === "student" && (
            <Badge count={unreadCount} offset={[0, 0]}>
              <BellOutlined
                style={{ fontSize: 22, color: "#FFD700", cursor: "pointer" }}
                onClick={() => setNotifVisible(true)}
              />
            </Badge>
          )}
          <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
            <Avatar size="large" icon={<UserOutlined />} style={{ cursor: "pointer", backgroundColor: "#0B3D91" }} />
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
          <p>User not logged in</p>
        )}
      </Modal>

      {/* Notifications Modal */}
      {user?.role === "student" && (
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
