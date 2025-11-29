import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  InputNumber,
  Tag,
  message,
  Popconfirm,
  Typography,
  Select,
  DatePicker
} from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, DollarOutlined } from '@ant-design/icons';
import { apiService } from '../services/apiService';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const DonationManagementPage: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDonation, setEditingDonation] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isDarkMode } = useTheme();
  const [donationForm] = Form.useForm();

  // Fetch donations from the API
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      // Get donations from the money collections endpoint
      const donationsList = await apiService.getMoneyCollections();
      setDonations(donationsList || []);
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Failed to load donations');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit donation
  const handleEditDonation = (donation: any) => {
    setEditingDonation(donation);
    donationForm.setFieldsValue({
      amount: donation.amount,
      description: donation.description,
      category: donation.category,
      collectedBy: donation.collectedBy?.name || donation.collectedBy,
      userId: donation.userId?._id || donation.userId,
      date: donation.collectedDate ? dayjs(donation.collectedDate) : null,
      receiptNumber: donation.receiptNumber
    });
    setShowEditModal(true);
  };

  // Handle delete donation
  const handleDeleteDonation = async (donationId: string) => {
    try {
      // Call the API to delete the donation
      await apiService.deleteDonation(donationId);

      // Update the donation list
      setDonations(prevDonations => prevDonations.filter(donation => donation.id !== donationId));
      toast.success('Donation deleted successfully');
    } catch (error) {
      console.error('Error deleting donation:', error);
      toast.error('Failed to delete donation');
    }
  };

  // Handle form submission to update donation
  const handleUpdateDonation = async (values: any) => {
    try {
      // Prepare the data in the format expected by the API
      const updateData = {
        ...values,
        collectedDate: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };

      // Call the API to update the donation
      const response = await apiService.updateDonation(editingDonation.id, updateData);

      // Update the donation in the local state
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation.id === editingDonation.id
            ? { ...donation, ...updateData }
            : donation
        )
      );

      setShowEditModal(false);
      setEditingDonation(null);
      donationForm.resetFields();
      toast.success(response.message || 'Donation updated successfully');
    } catch (error: any) {
      console.error('Error updating donation:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update donation';
      toast.error(errorMsg);
    }
  };

  // Filter donations based on search term
  const filteredDonations = donations.filter(donation => {
    if (!searchTerm) return true;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (donation.description && donation.description.toLowerCase().includes(searchTermLower)) ||
      (donation.receiptNumber && donation.receiptNumber.toLowerCase().includes(searchTermLower)) ||
      (donation.category && donation.category.toLowerCase().includes(searchTermLower)) ||
      (donation.collectedBy && 
        (typeof donation.collectedBy === 'object' 
          ? donation.collectedBy.name 
          : donation.collectedBy
        ).toLowerCase().includes(searchTermLower))
    );
  });

  // Define table columns
  const columns = [
    {
      title: 'Receipt No.',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      responsive: ['md'], // Hide on small screens
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <span style={{ fontWeight: 'bold' }}>₹{amount?.toLocaleString() || 0}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['lg'], // Hide on medium and small screens
    },
    {
      title: 'Fund Type',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        let color = 'blue';
        if (category === 'mayyathu') color = 'volcano';
        if (category === 'monthly_donation') color = 'green';
        if (category === 'general') color = 'geekblue';
        
        return <Tag color={color}>{category?.replace('_', ' ') || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Date',
      dataIndex: 'collectedDate',
      key: 'collectedDate',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A',
      responsive: ['md'], // Hide on small screens
    },
    {
      title: 'Collected By',
      dataIndex: 'collectedBy',
      key: 'collectedBy',
      render: (collectedBy: any) => {
        return collectedBy?.name || collectedBy || 'N/A';
      },
      responsive: ['lg'], // Hide on medium and small screens
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditDonation(record)}
            style={{ padding: '0 4px' }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this donation?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteDonation(record.id)}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              style={{ padding: '0 4px' }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div>
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ margin: 0, color: '#0D6D3F' }}>
                <DollarOutlined /> Donation Management
              </Title>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Input
                  placeholder="Search donations..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 250 }}
                  size="large"
                />
              </div>
            </div>
          }
          style={{ margin: '20px' }}
        >
          <Table
            dataSource={filteredDonations}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredDonations.length,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} donations`,
            }}
            scroll={{ x: 800 }}
            style={{ marginTop: 20 }}
          />
        </Card>

        {/* Edit Donation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditOutlined style={{ color: '#0D6D3F' }} />
              <span>Edit Donation</span>
            </div>
          }
          open={showEditModal}
          onCancel={() => {
            setShowEditModal(false);
            setEditingDonation(null);
            donationForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={donationForm}
            layout="vertical"
            onFinish={handleUpdateDonation}
            initialValues={{
              amount: 0,
              description: '',
              category: '',
              collectedBy: '',
              date: null,
              receiptNumber: ''
            }}
          >
            <Form.Item
              name="receiptNumber"
              label="Receipt Number"
              rules={[{ required: true, message: 'Please enter receipt number' }]}
            >
              <Input placeholder="Enter receipt number" />
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
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <Input placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Fund Type"
              rules={[{ required: true, message: 'Please select a fund type' }]}
            >
              <Select placeholder="Select fund type">
                <Option value="monthly_donation">Monthly Fund</Option>
                <Option value="mayyathu">Mayyathu Fund</Option>
                <Option value="general">General Fund</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="date"
              label="Collection Date"
            >
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                placeholder="Select date"
                format="YYYY-MM-DD"
              />
            </Form.Item>

            <Form.Item
              name="collectedBy"
              label="Collected By (Admin Name)"
              rules={[{ required: true, message: 'Please enter admin name' }]}
            >
              <Input placeholder="Enter admin name" />
            </Form.Item>

            <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDonation(null);
                    donationForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Update Donation
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default DonationManagementPage;