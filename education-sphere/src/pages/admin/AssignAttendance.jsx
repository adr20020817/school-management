// src/pages/admin/AssignGrades.jsx
import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Card, message } from "antd";
import { useAuth } from "../../context/AuthContext";

const gradeToPoint = {
  "A+": 5,
  A: 4.5,
  "B+": 4,
  B: 3.5,
  C: 3,
  D: 2,
  F: 0,
};

const AssignGrades = () => {
  const { students, setStudents } = useAuth();
  const [editingStudent, setEditingStudent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (student) => {
    setEditingStudent(student);
    setModalVisible(true);
  };

  const saveGrades = (values) => {
    const updatedStudents = students.map((s) => {
      if (s.regNo === editingStudent.regNo) {
        const grades = values.grades || [];
        const totalPoints = grades.reduce(
          (sum, g) => sum + (gradeToPoint[g.grade] || 0),
          0
        );
        const gpa = grades.length ? (totalPoints / grades.length).toFixed(2) : 0;
        return { ...s, grades, gpa };
      }
      return s;
    });

    setStudents(updatedStudents);
    message.success("Grades updated successfully!");
    setModalVisible(false);
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Reg No", dataIndex: "regNo", key: "regNo" },
    {
      title: "GPA",
      dataIndex: "gpa",
      key: "gpa",
      render: (val) => val || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => openModal(record)}
          style={{
            backgroundColor: "#0B3D91",
            borderColor: "#FFD700",
            color: "#FFD700",
          }}
        >
          Assign Grades
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">Assign Grades</h1>

      <Table
        columns={columns}
        dataSource={students}
        rowKey="regNo"
        bordered
        pagination={{ pageSize: 8 }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "bg-white" : "bg-gray-50"
        }
        scroll={{ x: "max-content" }}
        className="assign-grades-table"
      />

      <Modal
        title={`Assign Grades - ${editingStudent?.name || ""}`}
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        {editingStudent && (
          <Form
            layout="vertical"
            initialValues={{
              grades:
                editingStudent.grades && editingStudent.grades.length
                  ? editingStudent.grades
                  : [{}], // always start with 1 empty row
            }}
            onFinish={saveGrades}
          >
            <Form.List name="grades">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex gap-2 mb-2">
                      <Form.Item
                        {...restField}
                        name={[name, "subject"]}
                        rules={[{ required: true, message: "Enter subject" }]}
                      >
                        <Input placeholder="Subject" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "grade"]}
                        rules={[{ required: true, message: "Enter grade" }]}
                      >
                        <Input placeholder="Grade (A+, A, B+…)" />
                      </Form.Item>
                      <Button danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </div>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      style={{ borderColor: "#FFD700", color: "#0B3D91" }}
                    >
                      Add Grade
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  backgroundColor: "#0B3D91",
                  borderColor: "#FFD700",
                  color: "#FFD700",
                }}
              >
                Save Grades
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>

      <style>
        {`
          .assign-grades-table .ant-table-thead > tr > th {
            background-color: #0B3D91;
            color: #FFD700;
            font-weight: bold;
            text-align: center;
          }
          .assign-grades-table .ant-table-tbody > tr:hover {
            background-color: rgba(255, 215, 0, 0.2);
          }
        `}
      </style>
    </Card>
  );
};

export default AssignGrades;
