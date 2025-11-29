import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Typography,
  message,
  Divider,
  Modal,
  Select
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  EditOutlined,
  SaveOutlined,
  SkinOutlined
} from '@ant-design/icons';
import { apiService } from '../services/apiService';
import AppLayout from '../components/AppLayout';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user, updateProfile } = useAuthStore();
  const { theme, setTheme, isDarkMode } = useTheme();

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // The user data is already in the store
        if (user) {
          profileForm.setFieldsValue({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, profileForm]);

  // Handle profile update
  const handleProfileUpdate = async (values: any) => {
    setSaving(true);
    try {
      // In a real app, you would send this to the backend
      // For now, we'll just update the local store
      await updateProfile(values);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (values: any) => {
    if (values.newPassword !== values.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (values.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      // In a real app, you would send this to the backend
      // For now, we'll just show a success message
      console.log('Password change request:', values);
      
      // Reset form and close modal
      passwordForm.resetFields();
      setShowPasswordModal(false);
      
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    }
  };


  return (
    <AppLayout>
      <div>
        <Card 
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#0D6D3F' }}>Profile Settings</Title>
              <Text type="secondary">Manage your account information</Text>
            </div>
          }
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Card title="Personal Information" size="small">
                <Form
                  form={profileForm}
                  layout="vertical"
                  onFinish={handleProfileUpdate}
                  initialValues={{
                    name: '',
                    email: '',
                    phone: '',
                  }}
                >
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please enter your full name' }]}
                  >
                    <Input 
                      prefix={<UserOutlined />} 
                      placeholder="Enter your full name" 
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                  >
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Enter your email" 
                      disabled // Email typically can't be changed without verification
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label="Phone Number"
                  >
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="Enter your phone number" 
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<SaveOutlined />}
                      loading={saving}
                      size="large"
                      style={{ width: '100%' }}
                    >
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Security Settings" size="small">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    icon={<LockOutlined />}
                    size="large"
                    onClick={() => setShowPasswordModal(true)}
                    style={{ width: '100%' }}
                  >
                    Change Password
                  </Button>

                  <Divider>Theme Settings</Divider>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <SkinOutlined style={{ fontSize: '16px', color: '#0D6D3F' }} />
                      <span>App Theme:</span>
                    </div>

                    <Select
                      defaultValue={theme}
                      onChange={setTheme}
                      style={{ width: '100%' }}
                      size="large"
                      options={[
                        { value: 'light', label: 'Light Theme' },
                        { value: 'dark', label: 'Dark Theme' },
                        { value: 'system', label: 'System Default' }
                      ]}
                    />

                    <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                      {theme === 'light'
                        ? 'Light theme: Easy on the eyes in well-lit environments'
                        : theme === 'dark'
                        ? 'Dark theme: Reduces eye strain in low-light conditions'
                        : 'System theme: Automatically matches your device settings'}
                    </div>
                  </div>
                </Space>
              </Card>

              <Card title="Account Information" size="small" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    backgroundColor: '#0D6D3F', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: 16
                  }}>
                    <UserOutlined style={{ fontSize: 24, color: 'white' }} />
                  </div>
                  <div>
                    <Title level={5} style={{ margin: 0 }}>{user?.name}</Title>
                    <Text type="secondary">{user?.email}</Text>
                  </div>
                </div>
                
                <div style={{ marginTop: 16 }}>
                  <Text strong>Member Since:</Text>
                  <Text> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Text>
                </div>

                <div style={{ marginTop: 8 }}>
                  <Text strong>Registration ID:</Text>
                  <Text> {user?.registrationNumber ? user.registrationNumber : 'N/A'}</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Change Password Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <LockOutlined style={{ marginRight: 8, color: '#0D6D3F' }} />
              <span>Change Password</span>
            </div>
          }
          open={showPasswordModal}
          onCancel={() => {
            setShowPasswordModal(false);
            passwordForm.resetFields();
          }}
          footer={null}
          width={500}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={handlePasswordChange}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password 
                placeholder="Enter current password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 6, message: 'Password must be at least 6 characters long' }
              ]}
            >
              <Input.Password 
                placeholder="Enter new password" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmNewPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                placeholder="Confirm new password" 
                size="large"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={() => {
                    setShowPasswordModal(false);
                    passwordForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={saving}
                >
                  Update Password
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;