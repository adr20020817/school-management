// src/pages/students/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import { useAuth } from "../../context/AuthContext";

// Mock student data (replace with API/backend later)
const mockStudentData = [
  {
    id: 1,
    name: "John Doe",
    attendance: 92,
    gpa: 3.7,
    grades: [
      { key: 1, subject: "Math", grade: "A" },
      { key: 2, subject: "English", grade: "B+" },
      { key: 3, subject: "Science", grade: "A-" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    attendance: 88,
    gpa: 3.4,
    grades: [
      { key: 1, subject: "Math", grade: "B+" },
      { key: 2, subject: "English", grade: "A" },
      { key: 3, subject: "Science", grade: "B" },
    ],
  },
];

const StudentDashboard = () => {
  const { user } = useAuth(); // Get logged-in user
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "student") return;

    // Find current student's data
    const data = mockStudentData.find((s) => s.id === user.id);
    setStudentData(data);
  }, [user]);

  if (!studentData) {
    return <p className="p-6 text-center text-gray-500">Loading student data...</p>;
  }

  const gradesColumns = [
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Grade", dataIndex: "grade", key: "grade" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {studentData.name}</h1>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic title="Attendance" value={`${studentData.attendance}%`} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="Overall GPA" value={studentData.gpa} />
          </Card>
        </Col>
      </Row>

      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Grades</h2>
        <Table columns={gradesColumns} dataSource={studentData.grades} pagination={false} />
      </Card>
    </div>
  );
};

export default StudentDashboard;
