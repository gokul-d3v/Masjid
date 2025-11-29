import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Input, Card, Typography, message, Space, Alert } from 'antd';
import { authService } from '../services/authService';

const { Title, Text } = Typography;

const OTPVerificationPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from previous step
  const [userData, setUserData] = useState<any>(location.state?.userData || null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');

  // Initialize countdown timer
  useEffect(() => {
    if (userData?.email) {
      setCountdown(300); // 5 minutes in seconds
    }
  }, [userData]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onFinish = async (values: any) => {
    if (!userData) {
      message.error('Registration data not found. Please start registration again.');
      navigate('/signup');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOTPAndRegister({
        ...userData,
        otp: values.otp
      });

      message.success('Registration successful!');
      // Save token to localStorage (or context)
      localStorage.setItem('token', response.token);

      // Show registration number to user
      if (response.user?.registrationNumber) {
        message.success(`Your Registration ID is: ${response.user.registrationNumber}`);
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('OTP verification error:', err);
      const errorMsg = err.response?.data?.error || 'Invalid or expired OTP. Please try again.';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userData?.email) {
      message.error('Email not found. Please start registration again.');
      navigate('/signup');
      return;
    }

    setResendLoading(true);
    
    try {
      await authService.requestOTP({
        email: userData.email,
        name: userData.name,
        password: userData.password,
        phone: userData.phone
      });

      message.success('OTP sent successfully. Please check your email.');
      setCountdown(300); // Reset to 5 minutes
    } catch (err: any) {
      console.error('Resend OTP error:', err);
      const errorMsg = err.response?.data?.error || 'Failed to send OTP. Please try again.';
      message.error(errorMsg);
    } finally {
      setResendLoading(false);
    }
  };

  // If no user data from previous step, redirect to signup
  if (!userData) {
    useEffect(() => {
      message.error('Please complete registration details first.');
      navigate('/signup');
    }, [navigate]);
    return null;
  }

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', 
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        styles={{ body: { padding: '24px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ marginBottom: '8px', color: '#0D6D3F' }}>
            Verify Your Account
          </Title>
          <Text type="secondary">
            Enter the 6-digit OTP sent to <strong>{userData.email}</strong>
          </Text>
        </div>

        {error && (
          <Alert
            message="Verification Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="OTP Code"
            name="otp"
            rules={[
              { required: true, message: 'Please enter the OTP' },
              { 
                pattern: /^\d{6}$/, 
                message: 'Please enter a valid 6-digit OTP' 
              }
            ]}
          >
            <Input 
              placeholder="Enter 6-digit OTP" 
              size="large"
              maxLength={6}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              style={{ width: '100%' }}
            >
              Verify & Register
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" align="center" size="small">
              {countdown > 0 ? (
                <Text type="secondary">
                  Resend OTP in {formatTime(countdown)}
                </Text>
              ) : (
                <Button 
                  type="link" 
                  onClick={handleResendOTP} 
                  loading={resendLoading}
                  disabled={resendLoading}
                >
                  Resend OTP
                </Button>
              )}
              
              <Button 
                type="link" 
                onClick={() => navigate('/signup')}
                style={{ padding: 0 }}
              >
                Change Email
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default OTPVerificationPage;