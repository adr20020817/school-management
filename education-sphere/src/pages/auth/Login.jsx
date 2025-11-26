// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { Form, Input, Button, Select } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "/src/assets/images/Logo.png";

const { Option } = Select;

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setError("");
    const success = await login(values);
    if (!success) return;

    switch (values.role) {
      case "admin": navigate("/admin"); break;
      case "teacher": navigate("/teacher"); break;
      case "finance": navigate("/finance"); break;
      case "parent": navigate("/parent"); break;
      case "student": navigate("/student"); break;
      default: navigate("/"); break;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <img src={logo} alt="ElimuSphere" className="w-32 h-32 mb-6" />
      <div className="bg-white border p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl text-center font-bold mb-6" style={{ color: "#0B3D91" }}>
          Login
        </h2>
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: "Enter email" }]}>
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Enter password" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item name="role" rules={[{ required: true, message: "Select role" }]}>
            <Select placeholder="Select Role">
              <Option value="admin">Admin</Option>
              <Option value="teacher">Teacher</Option>
              <Option value="finance">Finance</Option>
              <Option value="parent">Parent</Option>
              <Option value="student">Student</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ backgroundColor: "#0B3D91", color: "#FFD700" }}>
              Log In
            </Button>
          </Form.Item>
        </Form>

        <div className="flex justify-between text-sm mt-4">
          <Link to="/forgot-password" className="text-yellow-400">Forgot Password?</Link>
          <Link to="/register" className="text-yellow-400">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
