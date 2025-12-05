// src/pages/admin/ManageParents.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Card } from "antd";
import { useAuth } from "../../context/AuthContext";

const ManageParents = () => {
  const { parents = [], setParents } = useAuth(); // pull from AuthContext
  const [editingParent, setEditingParent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // Sync table data with AuthContext
  useEffect(() => {
    setDataSource(parents);
  }, [parents]);

  // --- Open Add/Edit Modal ---
  const openModal = (parent = null) => {
    setEditingParent(parent);
    setModalVisible(true);
  };

  // --- Save Parent ---
  const saveParent = (values) => {
    let updatedParents;
    if (editingParent) {
      // Edit existing
      updatedParents = parents.map((p) =>
        p.id === editingParent.id ? { ...p, ...values } : p
      );
      message.success("Parent updated successfully!");
    } else {
      // Add new
      const newParent = { id: Date.now().toString(), ...values };
      updatedParents = [...parents, newParent];
      message.success("Parent added successfully!");
    }
    setParents(updatedParents); // live update via AuthContext
    setModalVisible(false);
    setEditingParent(null);
  };

  // --- Delete Parent ---
  const deleteParent = (id) => {
    const updated = parents.filter((p) => p.id !== id);
    setParents(updated);
    message.success("Parent deleted successfully!");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => openModal(record)} style={{ color: "#FFD700" }}>
            Edit
          </Button>
          <Button danger onClick={() => deleteParent(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="p-6 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-yellow-500">Manage Parents</h1>
        <Button
          type="primary"
          onClick={() => openModal()}
          style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}
        >
          Add Parent
        </Button>
      </div>

      {dataSource.length > 0 ? (
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          bordered
        />
      ) : (
        <p className="text-gray-500 text-center mt-6">No parents registered yet.</p>
      )}

      <Modal
        title={editingParent ? "Edit Parent" : "Add Parent"}
        open={modalVisible}
        footer={null}
        onCancel={() => {
          setModalVisible(false);
          setEditingParent(null);
        }}
      >
        <Form
          layout="vertical"
          initialValues={editingParent || { name: "", email: "" }}
          onFinish={saveParent}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter valid email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageParents;
