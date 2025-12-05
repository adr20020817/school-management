// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "/src/assets/images/Logo.png";

const AdminLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);

    // Simulate login check (replace with real API later)
    const { email, password } = values;
    if (email === "admin@elimusphere.com" && password === "admin@2002!fR") {
      // Set user in context
      login({
        name: "Admin User",
        email,
        role: "admin",
      });

      message.success("Login successful!");
      navigate("/admin"); // Redirect to admin dashboard
    } else {
      message.error("Invalid credentials!");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Card
        title={
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span style={{ color: "#0B3D91", fontWeight: "bold" }}>Admin Login</span>
          </div>
        }
        className="w-full max-w-md shadow-lg rounded-lg"
        headStyle={{ borderBottom: "none" }}
      >
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="admin@elimusphere.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="admin123" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
