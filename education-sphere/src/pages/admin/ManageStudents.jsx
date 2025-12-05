// src/pages/admin/ManageStudents.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { useAuth } from "../../context/AuthContext";

const gradeToPoint = { "A+": 5, A: 4.5, "B+": 4, B: 3.5, C: 3, D: 2, F: 0 };

const ManageStudents = () => {
  const { students, setStudents } = useAuth();
  const [editingStudent, setEditingStudent] = useState(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [gradesModalVisible, setGradesModalVisible] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  // Sync table data with AuthContext
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDataSource(students || []);
  }, [students]);

  // --- Add Student ---
  const openAddModal = () => setAddModalVisible(true);

  const saveNewStudent = (values) => {
    const regNo = "STU" + Math.floor(10000 + Math.random() * 90000);
    const newStudent = {
      ...values,
      role: "student",
      regNo,
      attendanceRecords: [],
      grades: [],
      gpa: 0,
    };
    setStudents([...students, newStudent]);
    message.success(`Student added successfully! Reg No: ${regNo}`);
    setAddModalVisible(false);
  };

  // --- Attendance ---
  const openAttendanceModal = (student) => {
    setEditingStudent(student);
    setAttendanceModalVisible(true);
  };

  const saveAttendance = (values) => {
    const updatedStudents = students.map((s) => {
      if (s.regNo === editingStudent.regNo) {
        return { ...s, attendanceRecords: values.records || [] };
      }
      return s;
    });
    setStudents(updatedStudents);
    message.success("Attendance updated successfully!");
    setAttendanceModalVisible(false);
    setEditingStudent(null);
  };

  // --- Grades ---
  const openGradesModal = (student) => {
    setEditingStudent(student);
    setGradesModalVisible(true);
  };

  const saveGrades = (values) => {
    const updatedStudents = students.map((s) => {
      if (s.regNo === editingStudent.regNo) {
        const grades = values.grades || [];
        const totalPoints = grades.reduce((sum, g) => sum + (gradeToPoint[g.grade] || 0), 0);
        const gpa = grades.length ? (totalPoints / grades.length).toFixed(2) : 0;
        return { ...s, grades, gpa };
      }
      return s;
    });
    setStudents(updatedStudents);
    message.success("Grades updated successfully!");
    setGradesModalVisible(false);
    setEditingStudent(null);
  };

  // --- Delete Student ---
  const deleteStudent = (regNo) => {
    const updated = students.filter((s) => s.regNo !== regNo);
    setStudents(updated);
    message.success("Student deleted successfully!");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Reg No", dataIndex: "regNo", key: "regNo" },
    {
      title: "Attendance",
      key: "attendance",
      render: (_, record) => (
        <Button type="primary" onClick={() => openAttendanceModal(record)}>
          {record.attendanceRecords?.length > 0 ? "Edit Attendance" : "Assign Attendance"}
        </Button>
      ),
    },
    {
      title: "Grades",
      key: "grades",
      render: (_, record) => (
        <Button type="primary" onClick={() => openGradesModal(record)}>
          {record.grades?.length > 0 ? "Edit Grades" : "Assign Grades"}
        </Button>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => deleteStudent(record.regNo)}>
          Delete Student
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Students</h1>
        <Button
          type="primary"
          onClick={openAddModal}
          style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}
        >
          Add Student
        </Button>
      </div>

      {dataSource.length > 0 ? (
        <Table columns={columns} dataSource={dataSource} rowKey="regNo" pagination={{ pageSize: 8 }} />
      ) : (
        <p>No students registered yet.</p>
      )}

      {/* Add Student Modal */}
      <Modal title="Add New Student" open={addModalVisible} onCancel={() => setAddModalVisible(false)} footer={null}>
        <Form layout="vertical" onFinish={saveNewStudent}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}>
              Add Student
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Attendance Modal */}
      <Modal
        title={`Attendance - ${editingStudent?.name || ""}`}
        open={attendanceModalVisible}
        onCancel={() => {
          setAttendanceModalVisible(false);
          setEditingStudent(null);
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={saveAttendance} initialValues={{ records: editingStudent?.attendanceRecords || [] }}>
          <Form.List name="records">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-2 mb-2">
                    <Form.Item {...restField} name={[name, "date"]} rules={[{ required: true, message: "Enter date" }]}>
                      <Input placeholder="Date" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "status"]} rules={[{ required: true, message: "Enter status" }]}>
                      <Input placeholder="Status (Present/Absent)" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>Remove</Button>
                  </div>
                ))}
                <Button type="dashed" block onClick={() => add()} style={{ borderColor: "#FFD700", color: "#0B3D91" }}>
                  Add Record
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}>
              Save Attendance
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Grades Modal */}
      <Modal
        title={`Grades - ${editingStudent?.name || ""}`}
        open={gradesModalVisible}
        onCancel={() => {
          setGradesModalVisible(false);
          setEditingStudent(null);
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={saveGrades}
          initialValues={{ grades: editingStudent?.grades?.length ? editingStudent.grades : [{}] }}
        >
          <Form.List name="grades">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-2 mb-2">
                    <Form.Item {...restField} name={[name, "subject"]} rules={[{ required: true, message: "Enter subject" }]}>
                      <Input placeholder="Subject" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, "grade"]} rules={[{ required: true, message: "Enter grade" }]}>
                      <Input placeholder="Grade (A+, A, B+…)" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>Remove</Button>
                  </div>
                ))}
                <Button type="dashed" block onClick={() => add()} style={{ borderColor: "#FFD700", color: "#0B3D91" }}>
                  Add Grade
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}>
              Save Grades
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageStudents;
