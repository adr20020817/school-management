// src/pages/auth/Login.jsx
import React from "react";
import { Form, Input, Button, Select, message, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "/src/assets/images/Logo.png";

const { Option } = Select;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const loggedUser = await login({
        identifier: values.identifier,
        password: values.password,
        role: values.role,
      });

      message.success(`Welcome back, ${loggedUser.name}!`);

      // Role-based navigation
      if (loggedUser.role === "student") navigate("/student");
      else if (loggedUser.role === "teacher") navigate("/teacher");
      else navigate("/");
    } catch (err) {
      message.error(err.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: "#0B3D91", padding: "2rem" }}
    >
      <img src={logo} alt="ElimuSphere" className="w-20 h-20 mb-4" />
      <h1 className="text-white text-3xl font-bold mb-6">ElimuSphere Login</h1>

      <Form
        name="loginForm"
        layout="vertical"
        onFinish={onFinish}
        style={{
          maxWidth: 400,
          width: "100%",
          background: "#fff",
          padding: "2rem",
          borderRadius: 8,
        }}
      >
        {/* Email or Reg No */}
        <Form.Item
          label="Email or Reg No"
          name="identifier"
          rules={[
            { required: true, message: "Please enter your email or reg no" },
          ]}
        >
          <Input placeholder="Enter email or Reg No" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        {/* Role */}
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select your role" }]}
        >
          <Select placeholder="Select role">
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>
        </Form.Item>

        {/* Login Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              backgroundColor: "#FFD700",
              color: "#0B3D91",
              fontWeight: "bold",
            }}
          >
            Login
          </Button>
        </Form.Item>

        {/* Forgot password link */}
        <p className="text-center mb-2">
          <Link to="/forgot-password" className="text-blue-900 font-semibold">
            Forgot Password?
          </Link>
        </p>

        {/* Register link */}
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-900 font-semibold">
            Register
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default Login;
