import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Select,
  InputNumber,
  Typography,
  Divider
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { apiService } from '../services/apiService';
import AppLayout from '../components/AppLayout';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const AddUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([
    { id: Date.now(), name: '', relation: '', age: null }
  ]);

  // Generate registration number function (kept for refresh button functionality)


  // Function to generate a sample registration number for reference
  const generateRegistrationNumber = async () => {
    // Generate a random 4-digit number
    const random = Math.floor(1000 + Math.random() * 9000).toString(); // Generates numbers from 1000 to 9999
    // Prefix with REG to form a 4-digit registration number like REG1234
    const candidateRegNumber = `REG${random}`;

    // Show the sample registration number in a toast for user reference
    toast.info(`Sample registration number: ${candidateRegNumber}. You can copy this or enter your own.`);
  };

  // Handle adding a new family member
  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { id: Date.now(), name: '', relation: '', age: null }
    ]);
  };

  // Handle removing a family member
  const removeFamilyMember = (id: number) => {
    if (familyMembers.length <= 1) {
      toast.warn('At least one family member is required');
      return;
    }
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  // Handle family member field changes
  const handleFamilyMemberChange = (id: number, field: string, value: any) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      // Prepare family members data
      const familyMembersData = familyMembers.map(member => ({
        name: member.name,
        relation: member.relation,
        age: member.age
      })).filter(member => member.name && member.relation); // Filter out empty entries

      // Prepare the complete user data
      const userData = {
        ...values,
        familyMembers: familyMembersData,
        familyMembersCount: familyMembersData.length
      };

      // Send the data to your backend
      const response = await apiService.addUser(userData);

      toast.success(response.message || 'User registered successfully!');

      // Reset form
      form.resetFields();
      setFamilyMembers([{ id: Date.now(), name: '', relation: '', age: null }]);

      // Generate a new registration number for the next entry
      await generateRegistrationNumber();
    } catch (error: any) {
      console.error('Error registering user:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to register user. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const relationOptions = [
    'Spouse', 'Son', 'Daughter', 'Father', 'Mother', 
    'Brother', 'Sister', 'Grandson', 'Granddaughter', 
    'Grandfather', 'Grandmother', 'Uncle', 'Aunt', 
    'Nephew', 'Niece', 'Cousin', 'Other'
  ];

  const houseTypes = [
    'Independent House', 'Apartment', 'Villa', 'Row House', 
    'Duplex', 'Penthouse', 'Studio Apartment', 'Townhouse', 
    'Bungalow', 'Cottage', 'Other'
  ];

  return (
    <AppLayout>
      <div>
      <Card 
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          borderRadius: '12px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
        }}
        styles={{ body: { padding: '30px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#0D6D3F', marginBottom: '8px' }}>
            Add New Member
          </Title>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Register a new member with family details
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ familyMembersCount: 1 }}
        >
          <Row gutter={24}>
            {/* Personal Information Section */}
            <Col xs={24} md={12}>
              <Card
                title="Personal Information"
                style={{ marginBottom: '24px' }}
                size="small"
                styles={{ header: { backgroundColor: '#f8fafc', fontWeight: 'bold' } }}
              >
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[
                    { required: true, message: 'Please enter full name' },
                    { min: 2, message: 'Name must be at least 2 characters long' },
                    { max: 100, message: 'Name must not exceed 100 characters' },
                    { pattern: /^[a-zA-Z\s]+$/, message: 'Name must contain only letters and spaces' }
                  ]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                  name="age"
                  label="Age"
                  rules={[
                    { required: true, message: 'Please enter age' },
                    { type: 'number', min: 1, max: 120, message: 'Age must be between 1 and 120' }
                  ]}
                >
                  <InputNumber
                    placeholder="Enter age"
                    style={{ width: '100%' }}
                    min={1}
                    max={120}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                    { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number' },
                    { min: 10, message: 'Phone number must be 10 digits' }
                  ]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>

                <Form.Item
                  name="adharNumber"
                  label="Aadhaar Number"
                  rules={[
                    { required: true, message: 'Please enter Aadhaar number' },
                    { pattern: /^\d{12}$/, message: 'Please enter a valid 12-digit Aadhaar number' },
                    { min: 12, message: 'Aadhaar number must be 12 digits' },
                    { max: 12, message: 'Aadhaar number must be 12 digits' }
                  ]}
                >
                  <Input placeholder="Enter Aadhaar number" />
                </Form.Item>

                <Form.Item
                  name="registrationNumber"
                  label="Registration Number"
                  rules={[
                    { required: true, message: 'Please enter registration number' },
                    {
                      pattern: /^[A-Za-z0-9]+$/,
                      message: 'Registration number can only contain letters and numbers'
                    },
                    { min: 3, message: 'Registration number must be at least 3 characters long' },
                    { max: 20, message: 'Registration number must not exceed 20 characters' }
                  ]}
                >
                  <Input
                    placeholder="Enter registration number"
                    style={{ backgroundColor: 'white' }}
                    suffix={
                      <Button
                        type="text"
                        size="small"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await generateRegistrationNumber();
                        }}
                        title="Generate sample registration number"
                      >
                        🔄
                      </Button>
                    }
                  />
                </Form.Item>
              </Card>
            </Col>

            {/* House & Family Information Section */}
            <Col xs={24} md={12}>
              <Card
                title="House & Family Information"
                style={{ marginBottom: '24px' }}
                size="small"
                styles={{ header: { backgroundColor: '#f8fafc', fontWeight: 'bold' } }}
              >
                <Form.Item
                  name="houseType"
                  label="House Type"
                  rules={[{ required: true, message: 'Please select house type' }]}
                >
                  <Select placeholder="Select house type">
                    {houseTypes.map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="familyMembersCount"
                  label="Family Members Count"
                  rules={[{ required: true, message: 'Please enter family members count' }]}
                >
                  <InputNumber 
                    placeholder="Enter family members count" 
                    style={{ width: '100%' }}
                    min={1}
                    max={20}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          {/* Family Members Section */}
          <Card
            title="Family Members Details"
            style={{ marginBottom: '24px' }}
            size="small"
            styles={{ header: { backgroundColor: '#f8fafc', fontWeight: 'bold' } }}
          >
            {familyMembers.map((member, index) => (
              <Row key={member.id} gutter={16} style={{ marginBottom: '16px' }}>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={index === 0 ? "Name" : ""}
                    validateStatus={member.name ? "" : "error"}
                  >
                    <Input
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) => handleFamilyMemberChange(member.id, 'name', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={index === 0 ? "Relation" : ""}
                    validateStatus={member.relation ? "" : "error"}
                  >
                    <Select
                      placeholder="Relation to main member"
                      value={member.relation}
                      onChange={(value) => handleFamilyMemberChange(member.id, 'relation', value)}
                    >
                      {relationOptions.map(option => (
                        <Option key={option} value={option}>{option}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    label={index === 0 ? "Age" : ""}
                  >
                    <InputNumber
                      placeholder="Age"
                      value={member.age}
                      onChange={(value) => handleFamilyMemberChange(member.id, 'age', value)}
                      style={{ width: '100%' }}
                      min={0}
                      max={120}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={2} style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button
                    type="text"
                    danger
                    icon={<MinusCircleOutlined />}
                    onClick={() => removeFamilyMember(member.id)}
                    disabled={familyMembers.length <= 1}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            ))}

            <Form.Item>
              <Button 
                type="dashed" 
                onClick={addFamilyMember}
                icon={<PlusOutlined />}
                block
              >
                Add Family Member
              </Button>
            </Form.Item>
          </Card>

          {/* Submit Button */}
          <Form.Item style={{ textAlign: 'center' }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={loading}
                icon={<SaveOutlined />}
                style={{ 
                  backgroundColor: '#0D6D3F',
                  borderColor: '#0D6D3F',
                  padding: '0 30px',
                  fontWeight: '600'
                }}
              >
                Register Member
              </Button>
              <Button
                size="large"
                onClick={() => {
                  form.resetFields();
                  setFamilyMembers([{ id: Date.now(), name: '', relation: '', age: null }]);
                  toast.info('Form has been reset');
                }}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      </div>
    </AppLayout>
  );
};

export default AddUserPage;