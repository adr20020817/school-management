// src/pages/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Form, Input, InputNumber, message } from "antd";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/students`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load students");
      }
      setStudents(
        data.map((s) => ({
          key: s.studentId,
          ...s,
        }))
      );
    } catch (err) {
      message.error(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openEditModal = (student) => {
    setSelectedStudent(student);
    form.setFieldsValue({
      className: student.className || "",
      attendancePercent: student.attendancePercent ?? null,
      score: student.score ?? null,
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/api/students/${selectedStudent.studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const updated = await res.json();
      if (!res.ok) {
        throw new Error(updated.message || "Failed to update student");
      }
      setStudents((prev) =>
        prev.map((s) => (s.studentId === updated.studentId ? { key: updated.studentId, ...updated } : s))
      );
      message.success("Student record updated");
      setIsModalVisible(false);
      setSelectedStudent(null);
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return; // validation error
      message.error(err.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { title: "Student Name", dataIndex: "name", key: "name" },
    { title: "Reg No", dataIndex: "regNo", key: "regNo" },
    { title: "Class", dataIndex: "className", key: "className" },
    {
      title: "Attendance (%)",
      dataIndex: "attendancePercent",
      key: "attendancePercent",
      render: (value) => (value != null ? `${value}%` : "-"),
    },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Grade", dataIndex: "grade", key: "grade" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openEditModal(record)}>
          Assign / Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Manage Students</h2>
        <Table columns={columns} dataSource={students} loading={loading} />
      </Card>

      <Modal
        title={selectedStudent ? `Update ${selectedStudent.name}` : "Update Student"}
        open={isModalVisible}
        onOk={handleSave}
        confirmLoading={saving}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedStudent(null);
          form.resetFields();
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Class" name="className">
            <Input placeholder="e.g. Form 2" />
          </Form.Item>
          <Form.Item
            label="Attendance (%)"
            name="attendancePercent"
            rules={[
              { type: "number", min: 0, max: 100, message: "Attendance must be between 0 and 100" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="e.g. 95" />
          </Form.Item>
          <Form.Item
            label="Score"
            name="score"
            rules={[
              { type: "number", min: 0, max: 100, message: "Score must be between 0 and 100" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="e.g. 88" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeacherDashboard;
