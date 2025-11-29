import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Row,
  Col
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (values: { email: string; password: string }) => {
    const result = await login(values.email, values.password);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard after login
    }
  };

  const handleForgotPassword = () => {
    // Show toast for forgot password functionality
    toast.info('Password reset functionality is not implemented in demo. In a real app, a reset link would be sent to your email.');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        padding: '16px'
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, margin: '0 16px' }}>
        {/* Banner with splash image */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/Splash.png"
            alt="App Banner"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '150px',
              objectFit: 'contain'
            }}
          />
        </div>

        <Card
          style={{
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            borderRadius: '16px',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.85)'
          }}
          styles={{ body: { padding: '24px' } }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Typography.Title
              level={2}
              style={{
                fontWeight: 700,
                marginBottom: '8px',
                background: 'linear-gradient(135deg, #0D6D3F 0%, #1a9f5a 100%)', // Using the requested primary color
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '24px'
              }}
            >
              Welcome Back
            </Typography.Title>
            <Typography.Text type="secondary">
              Sign in to your account
            </Typography.Text>
          </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                padding: '12px 0',
                fontWeight: 600,
                fontSize: '16px'
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Button
            type="link"
            size="small"
            onClick={handleForgotPassword}
            style={{ padding: 0 }}
          >
            Forgot Password?
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;