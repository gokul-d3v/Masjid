import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
} from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';

const SignupPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: { name: string; email: string; phone: string; password: string; confirmPassword: string }) => {
    // Frontend password validation to match backend requirements
    if (values.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Check for at least one uppercase, one lowercase, and one number
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Request OTP to be sent to the email
      const result = await authService.requestOTP({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone
      });

      if (result.message) {
        toast.success('OTP sent successfully! Please check your email.');

        // Navigate to OTP verification page with user data
        navigate('/verify-otp', {
          state: {
            userData: {
              name: values.name,
              email: values.email,
              password: values.password,
              phone: values.phone
            }
          }
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMsg = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    }
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
      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          margin: '0 16px',
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
            Create Account
          </Typography.Title>
          <Typography.Text type="secondary">
            Join us today - Your Registration ID will be generated upon completion
          </Typography.Text>
        </div>

        <Form
          name="signup_form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter your phone number (optional)"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password!' },
              { min: 6, message: 'Password must be at least 6 characters long' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password (e.g. Abc123)"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
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
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Typography.Text type="secondary">
            Already have an account?{' '}
            <Button type="link" href="/login" style={{ padding: 0 }}>
              Sign in
            </Button>
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;