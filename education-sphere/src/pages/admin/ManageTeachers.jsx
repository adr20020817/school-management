import React, { useState } from "react";
import { Table, Button, Form, Input, Modal, message, Card } from "antd";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]); // starts empty
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // --- Open Add/Edit Modal ---
  const openModal = (teacher = null) => {
    setEditingTeacher(teacher);
    setModalVisible(true);
  };

  // --- Save Teacher ---
  const saveTeacher = (values) => {
    if (editingTeacher) {
      // Update existing teacher
      setTeachers((prev) =>
        prev.map((t) => (t.id === editingTeacher.id ? { ...t, ...values } : t))
      );
      message.success("Teacher updated!");
    } else {
      // Add new teacher
      const newTeacher = { ...values, id: Date.now().toString() };
      setTeachers((prev) => [...prev, newTeacher]);
      message.success("Teacher added!");
    }
    setModalVisible(false);
  };

  // --- Delete Teacher ---
  const deleteTeacher = (id) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    message.success("Teacher deleted!");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button onClick={() => openModal(record)}>Edit</Button>
          <Button danger onClick={() => deleteTeacher(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-yellow-500">Manage Teachers</h2>
        <Button type="primary" onClick={() => openModal()} style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}>
          Add Teacher
        </Button>
      </div>

      {teachers.length > 0 ? (
        <Table columns={columns} dataSource={teachers} rowKey="id" pagination={{ pageSize: 8 }} />
      ) : (
        <p className="text-gray-500 text-center mt-6">No teachers registered yet.</p>
      )}

      <Modal
        title={editingTeacher ? "Edit Teacher" : "Add Teacher"}
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Form layout="vertical" onFinish={saveTeacher} initialValues={editingTeacher}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageTeachers;
