import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const { Option } = Select;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const newUser = await register(values);

      message.success(
        `Registered successfully! Your Reg No: ${newUser.regNo || "N/A"}`
      );

      // Role-based navigation
      if (newUser.role === "student") {
        navigate("/student");
      } else if (newUser.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/login");
      }
    } catch (error) {
      message.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: "#0B3D91", padding: "2rem" }}
    >
      <h1 className="text-white text-3xl font-bold mb-6">
        ElimuSphere Register
      </h1>

      <Form
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
        {/* Full Name */}
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="example@email.com" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please enter a password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="••••••••" />
        </Form.Item>

        {/* Role */}
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>
        </Form.Item>

        {/* Register Button */}
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
            Register
          </Button>
        </Form.Item>

        {/* Login Link */}
        <div className="text-center mt-3">
          <span>Already have an account? </span>
          <Link
            to="/login"
            style={{ color: "#0B3D91", fontWeight: "bold" }}
          >
            Login
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
