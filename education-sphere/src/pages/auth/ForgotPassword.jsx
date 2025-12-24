// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = confirm OTP & new password
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const [form] = Form.useForm();

  const handleRequestOtp = async (values) => {
    try {
      setLoading(true);
      setEmail(values.email);
      const res = await fetch(`${API_BASE_URL}/api/auth/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }
      message.success("If the email exists, an OTP has been sent.");
      setStep(2);
      form.resetFields();
    } catch (err) {
      message.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: values.otp,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }
      message.success("Password reset successfully. You can now log in.");
      setStep(1);
      setEmail("");
      form.resetFields();
    } catch (err) {
      message.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card
        title={step === 1 ? "Forgot Password" : "Reset Password"}
        style={{ width: 400 }}
      >
        {step === 1 ? (
          <Form layout="vertical" form={form} onFinish={handleRequestOtp}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="student@example.com" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Send OTP
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form layout="vertical" form={form} onFinish={handleResetPassword}>
            <Form.Item label="Email">
              <Input value={email} disabled />
            </Form.Item>

            <Form.Item
              label="OTP"
              name="otp"
              rules={[{ required: true, message: "Please enter the OTP" }]}
            >
              <Input placeholder="Enter the 6-digit OTP" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="New password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}

        <div className="text-center">
          Back to <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
