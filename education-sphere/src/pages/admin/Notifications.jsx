import React, { useEffect, useState } from "react";
import { Card, List, Button, Modal, Input, Select, message, Popconfirm } from "antd";
import { BellOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    targetRoles: ["student"],
  });

  useEffect(() => {
    const allNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotifications(allNotifications);
  }, []);

  const saveToStorage = (updated) => {
    localStorage.setItem("notifications", JSON.stringify(updated));
    setNotifications(updated);
  };

  const addNotification = () => {
    const { title, message: msg, targetRoles } = newNotification;
    if (!title || !msg) {
      message.error("Please fill in all fields");
      return;
    }

    const id = Date.now().toString();
    const notif = { id, title, message: msg, read: false, targetRoles };
    const updated = [notif, ...notifications];
    saveToStorage(updated);

    setNewNotification({ title: "", message: "", targetRoles: ["student"] });
    setModalVisible(false);
    message.success("Notification added successfully!");
  };

  const markAsRead = (notifId) => {
    const updated = notifications.map((n) =>
      n.id === notifId ? { ...n, read: true } : n
    );
    saveToStorage(updated);
    message.success("Marked as read");
  };

  const deleteNotification = (notifId) => {
    const updated = notifications.filter((n) => n.id !== notifId);
    saveToStorage(updated);
    message.success("Notification deleted");
  };

  return (
    <Card className="shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-500">Notifications</h2>
        <Button
          style={{
            backgroundColor: "#FFD700",
            color: "#0B3D91",
            border: "none",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Notification
        </Button>
      </div>

      {notifications.length > 0 ? (
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{
                backgroundColor: item.read ? "#f0f0f0" : "#ffffff",
                padding: "12px",
                borderLeft: `6px solid ${item.read ? "#ddd" : "#FFD700"}`,
                borderRadius: "6px",
                marginBottom: "12px",
              }}
              actions={[
                !item.read && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => markAsRead(item.id)}
                  >
                    Mark as Read
                  </Button>
                ),
                <Popconfirm
                  title="Delete this notification?"
                  onConfirm={() => deleteNotification(item.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger size="small" icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<BellOutlined style={{ fontSize: 20, color: "#FFD700" }} />}
                title={item.title}
                description={item.message}
              />
            </List.Item>
          )}
        />
      ) : (
        <p className="text-gray-500 text-center">No notifications available.</p>
      )}

      <Modal
        title="Add Notification"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={addNotification}
        okText="Add"
      >
        <div className="space-y-4">
          <Input
            placeholder="Title"
            value={newNotification.title}
            onChange={(e) =>
              setNewNotification({ ...newNotification, title: e.target.value })
            }
          />
          <TextArea
            placeholder="Message"
            rows={4}
            value={newNotification.message}
            onChange={(e) =>
              setNewNotification({ ...newNotification, message: e.target.value })
            }
          />
          <Select
            mode="multiple"
            placeholder="Select target roles"
            value={newNotification.targetRoles}
            onChange={(roles) =>
              setNewNotification({ ...newNotification, targetRoles: roles })
            }
            style={{ width: "100%" }}
          >
            <Select.Option value="student">Student</Select.Option>
            <Select.Option value="teacher">Teacher</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="finance">Finance</Select.Option>
            <Select.Option value="parent">Parent</Select.Option>
          </Select>
        </div>
      </Modal>
    </Card>
  );
};

export default Notifications;
