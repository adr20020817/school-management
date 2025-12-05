// src/pages/admin/AdminDashboard.jsx
import React, { useMemo } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, TeamOutlined, DollarOutlined, BookOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { students = [], teachers = [] } = useAuth();

  // Compute pending fees dynamically
  const pendingFees = useMemo(() => {
    return students.reduce((sum, student) => {
      const feesArray = student.fees || [];
      const pending = feesArray
        .filter((f) => f.status?.toLowerCase() !== "paid")
        .reduce((s, f) => s + Number(f.amount || 0), 0);
      return sum + pending;
    }, 0);
  }, [students]);

  // Compute average GPA across all students
  const averageGPA = useMemo(() => {
    if (students.length === 0) return 0;
    const totalGPA = students.reduce((sum, s) => sum + (Number(s.gpa) || 0), 0);
    return (totalGPA / students.length).toFixed(2);
  }, [students]);

  // Compute total attendance records
  const totalAttendanceRecords = useMemo(() => {
    return students.reduce((sum, s) => sum + (s.attendanceRecords?.length || 0), 0);
  }, [students]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold mb-6" style={{ color: "#0B3D91" }}>
        Admin Dashboard
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            style={{ borderLeft: "6px solid #FFD700" }}
          >
            <Statistic
              title="Total Students"
              value={students.length}
              prefix={<UserOutlined style={{ color: "#FFD700" }} />}
              valueStyle={{ color: "#0B3D91", fontWeight: "bold", fontSize: "1.8rem" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            style={{ borderLeft: "6px solid #FFD700" }}
          >
            <Statistic
              title="Total Teachers"
              value={teachers.length}
              prefix={<TeamOutlined style={{ color: "#FFD700" }} />}
              valueStyle={{ color: "#0B3D91", fontWeight: "bold", fontSize: "1.8rem" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            style={{ borderLeft: "6px solid #FFD700" }}
          >
            <Statistic
              title="Pending Fees"
              value={pendingFees}
              prefix={<DollarOutlined style={{ color: "#FFD700" }} />}
              valueStyle={{ color: "#0B3D91", fontWeight: "bold", fontSize: "1.8rem" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            style={{ borderLeft: "6px solid #FFD700" }}
          >
            <Statistic
              title="Average GPA"
              value={averageGPA}
              prefix={<BookOutlined style={{ color: "#FFD700" }} />}
              valueStyle={{ color: "#0B3D91", fontWeight: "bold", fontSize: "1.8rem" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card
            className="shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            style={{ borderLeft: "6px solid #FFD700" }}
          >
            <Statistic
              title="Total Attendance Records"
              value={totalAttendanceRecords}
              prefix={<BookOutlined style={{ color: "#FFD700" }} />}
              valueStyle={{ color: "#0B3D91", fontWeight: "bold", fontSize: "1.8rem" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
