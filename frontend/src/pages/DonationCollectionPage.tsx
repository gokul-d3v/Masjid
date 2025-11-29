import React, { useState, useEffect } from 'react';
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
  DatePicker,
  Typography,
  message,
  Tag
} from 'antd';
import { DollarOutlined, UserOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { apiService } from '../services/apiService';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const DonationCollectionPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [mayyathuMembers, setMayyathuMembers] = useState<number[]>([]);
  const [receiptDetails, setReceiptDetails] = useState({
    fundType: '',
    amount: 0,
    collectedBy: '',
    date: dayjs().format('YYYY-MM-DD')
  });
  const { isDarkMode } = useTheme();

  // Fetch users from the API
  useEffect(() => {
    fetchUsers();
    generateReceiptNumber();
  }, []);


  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers();
      setUsers(usersData || []);

      // Also fetch mayyathu fund members
      const mayyathuUsers = usersData.filter((user: any) => {
        // If there's a specific field indicating mayyathu status, use that
        // For now, we'll assume all users are eligible for mayyathu
        return true;
      });
      
      setMayyathuMembers(mayyathuUsers.map((user: any) => user.id));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  // Generate a receipt number
  const generateReceiptNumber = () => {
    // Generate a unique receipt number like REC20251127001
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(100 + Math.random() * 900)); // 3-digit random number
    
    setReceiptNumber(`REC${year}${month}${day}${random}`);
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    // Validate if user is eligible for mayyathu fund
    if (values.fundType === 'mayyathu_fund' && values.userId) {
      const user = users.find(u => u.id === values.userId);
      if (!user || !user.mayyathuStatus) {
        toast.error('Selected user is not eligible for Mayyathu Fund. Please select another user or fund type.');
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      // Prepare the collection data
      const collectionData = {
        amount: values.amount,
        description: values.description || `${values.fundType} collection`,
        category: values.fundType,
        userId: values.userId,
        fundType: values.fundType,
        date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        collectedBy: values.collectedBy,
        receiptNumber
      };

      // Send the data to your backend
      const response = await apiService.addMoneyCollection(collectionData);

      toast.success(response.message || 'Donation collected successfully!');

      // Reset form and generate new receipt number
      form.resetFields();
      generateReceiptNumber();
    } catch (error: any) {
      console.error('Error collecting donation:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to collect donation. Please try again.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div>
        <Card
          title={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '8px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Title level={3} style={{ margin: 0, color: '#0D6D3F' }}>
                  <DollarOutlined /> Donation Collection
                </Title>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                width: '100%',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <Text strong style={{ marginRight: 8 }}>Receipt No:</Text>
                  <Tag color="green" style={{ fontSize: '16px', padding: '4px 12px' }}>
                    {receiptNumber}
                  </Tag>
                </div>
                <Button
                  type="primary"
                  onClick={generateReceiptNumber}
                  style={{
                    backgroundColor: '#0D6D3F',
                    borderColor: '#0D6D3F',
                    flexShrink: 0
                  }}
                >
                  Generate New Receipt
                </Button>
              </div>
            </div>
          }
          style={{ margin: '20px' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={(changedValues, allValues) => {
              setReceiptDetails({
                fundType: allValues.fundType || '',
                amount: allValues.amount || 0,
                collectedBy: allValues.collectedBy || '',
                date: allValues.date ? allValues.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
              });
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Card
                  title="Collection Details"
                  size="small"
                  headStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc', fontWeight: 'bold' }}
                >
                  <Form.Item
                    name="userId"
                    label="Select User"
                    rules={[{ required: true, message: 'Please select a user' }]}
                  >
                    <Select
                      placeholder="Select a user"
                      size="large"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.children as string).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {users.map(user => (
                        <Option key={user.id} value={user.id}>
                          {user.name} ({user.registrationNumber})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="fundType"
                    label="Fund Type"
                    rules={[{ required: true, message: 'Please select a fund type' }]}
                  >
                    <Select
                      placeholder="Select fund type"
                      size="large"
                    >
                      <Option value="monthly_fund">Monthly Fund</Option>
                      <Option value="mayyathu_fund">Mayyathu Fund</Option>
                    </Select>
                  </Form.Item>

                  {/* Conditional field for Mayyathu Fund */}
                  <Form.Item
                    noStyle
                    dependencies={['fundType', 'userId']}
                  >
                    {({ getFieldValue }) => {
                      const fundType = getFieldValue('fundType');
                      const userId = getFieldValue('userId');

                      if (fundType === 'mayyathu_fund' && userId) {
                        // Fetch user details to check mayyathu status
                        const user = users.find(u => u.id === userId);
                        const userIsMayyathuMember = user?.mayyathuStatus || false;

                        return (
                          <Form.Item
                            label="Mayyathu Fund Eligibility"
                            style={{ marginBottom: 16 }}
                          >
                            <div style={{
                              padding: '12px',
                              borderRadius: '6px',
                              backgroundColor: userIsMayyathuMember ? '#f6fef9' : '#fff8f8',
                              border: userIsMayyathuMember ? '1px solid #10b981' : '1px solid #ef4444'
                            }}>
                              <Text>
                                {userIsMayyathuMember
                                  ? <span style={{ color: '#10b981' }}>
                                      <TeamOutlined style={{ marginRight: 8 }} />
                                      This user is eligible for Mayyathu Fund
                                    </span>
                                  : <span style={{ color: '#ef4444' }}>
                                      <TeamOutlined style={{ marginRight: 8 }} />
                                      This user is NOT eligible for Mayyathu Fund
                                    </span>
                                }
                              </Text>
                            </div>
                          </Form.Item>
                        );
                      }
                      return null;
                    }}
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                  >
                    <Input
                      placeholder="Enter collection description"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="amount"
                    label="Amount (₹)"
                    rules={[{ required: true, message: 'Please enter the amount' }]}
                  >
                    <InputNumber
                      placeholder="Enter amount"
                      style={{ width: '100%' }}
                      size="large"
                      min={0}
                      precision={2}
                      formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/₹\s?|(,*)/g, '')}
                    />
                  </Form.Item>

                  <Form.Item
                    name="date"
                    label="Collection Date"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="Select date"
                      suffixIcon={<CalendarOutlined />}
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>

                  <Form.Item
                    name="collectedBy"
                    label="Collected By (Admin Name)"
                    rules={[{ required: true, message: 'Please enter admin name' }]}
                  >
                    <Input
                      placeholder="Enter admin name"
                      size="large"
                      prefix={<UserOutlined />}
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title="Receipt Information"
                  size="small"
                  headStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc', fontWeight: 'bold' }}
                >
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: isDarkMode ? '#111827' : '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Receipt Number: </Text>
                      <Text code style={{ fontSize: '16px', padding: '2px 8px' }}>
                        {receiptNumber}
                      </Text>
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Current Date: </Text>
                      <Text>{receiptDetails.date}</Text>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Fund Type: </Text>
                      <Text>
                        {receiptDetails.fundType
                          ? receiptDetails.fundType === 'monthly_fund'
                            ? 'Monthly Fund'
                            : 'Mayyathu Fund'
                          : 'Not selected'}
                      </Text>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Amount: </Text>
                      <Text style={{ color: '#0D6D3F', fontWeight: 'bold' }}>
                        ₹{receiptDetails.amount ? parseFloat(receiptDetails.amount).toLocaleString('en-IN') : '0.00'}
                      </Text>
                    </div>

                    <div>
                      <Text strong>Collected By: </Text>
                      <Text>{receiptDetails.collectedBy || 'Not entered'}</Text>
                    </div>
                  </div>
                </Card>
                
                <Card
                  title="Collection Summary"
                  size="small"
                  style={{ marginTop: '20px' }}
                  headStyle={{ backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc', fontWeight: 'bold' }}
                >
                  <div style={{ 
                    padding: '20px',
                    backgroundColor: isDarkMode ? '#374151' : '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isDarkMode ? '#4b5563' : '#a7f3d0'
                  }}>
                    <Text>Fill in the details to record the donation</Text>
                  </div>
                </Card>
              </Col>
            </Row>

            <Form.Item style={{ textAlign: 'center', marginTop: '24px' }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  style={{
                    backgroundColor: '#0D6D3F',
                    borderColor: '#0D6D3F',
                    padding: '0 30px',
                    fontWeight: '600'
                  }}
                >
                  Record Donation
                </Button>
                <Button
                  size="large"
                  onClick={() => {
                    form.resetFields();
                    generateReceiptNumber();
                  }}
                >
                  Reset Form
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DonationCollectionPage;