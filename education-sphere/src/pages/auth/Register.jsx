import React from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const { Option } = Select;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = (values) => {
    const newUser = register(values);
    message.success(`Registered successfully! Your Reg No: ${newUser.regNo || "-"}`);
    // Redirect to dashboard
    if (newUser.role === "student") navigate("/student");
    else if (newUser.role === "teacher") navigate("/teacher");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "#0B3D91", padding: "2rem" }}>
      <h1 className="text-white text-3xl font-bold mb-6">ElimuSphere Register</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 400, width: "100%", background: "#fff", padding: "2rem", borderRadius: 8 }}
      >
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select placeholder="Select role">
            <Option value="student">Student</Option>
            <Option value="teacher">Teacher</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#FFD700", color: "#0B3D91", fontWeight: "bold" }}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
