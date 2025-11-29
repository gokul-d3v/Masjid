import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card,
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
  Grid,
  Checkbox,
  Table,
  Row,
  Col,
  Divider,
  Option
} from 'antd';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { apiService } from '../services/apiService';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFamilyPreviewModal, setShowFamilyPreviewModal] = useState(false);
  const [showMayyathuModal, setShowMayyathuModal] = useState(false);
  const [selectedUserForMayyathu, setSelectedUserForMayyathu] = useState<any>(null);
  const [adminName, setAdminName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all'); // Filter by role
  const [statusFilter, setStatusFilter] = useState<string>('all'); // Filter by status
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const { isDarkMode } = useTheme();
  const [userForm] = Form.useForm();

  // Define user type for TanStack table
  type User = {
    id: string;
    name: string;
    age: number | null;
    email: string;
    phone: string;
    adharNumber: string;
    registrationNumber: string;
    houseType: string;
    familyMembers: any[];
    familyMembersCount: number;
    role: string;
    status: string;
    mayyathuStatus: boolean;
    createdAt: string;
    lastLogin: string | null;
  };

  // Sorting state for TanStack table
  const [sorting, setSorting] = useState<SortingState>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Add styles to hide scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch users from the API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      console.log('Attempting to fetch users...');
      let usersData = await apiService.getAllUsers();
      console.log('API Response:', usersData);

      // The API returns members in the 'members' property
      if (usersData && Array.isArray(usersData.users)) {
        usersData = usersData.users;
      } else if (usersData && Array.isArray(usersData.data)) {
        usersData = usersData.data;
      } else if (usersData && typeof usersData === 'object' && !Array.isArray(usersData)) {
        // If it's an object with users array inside
        usersData = usersData.users || usersData.data || usersData.members || [];
      }

      // Ensure usersData is an array
      if (!usersData || !Array.isArray(usersData)) {
        usersData = [];
      }

      // For pagination simulation, take only the current page of users
      const startIndex = (page - 1) * pageSize;
      const paginatedUsers = usersData.slice(startIndex, startIndex + pageSize);

      // Map member data to the user format expected by the table
      const mappedUsersData = paginatedUsers.map((member: any) => ({
        id: member.id,
        name: member.fullName || 'N/A',
        age: member.age || null,
        email: member.email || 'N/A', // If members don't have emails, we might need to handle this
        phone: member.phone || 'N/A',
        adharNumber: member.adharNumber || 'N/A',
        registrationNumber: member.registrationNumber || 'N/A',
        houseType: member.houseType || 'N/A',
        familyMembers: member.familyMembers || [],
        familyMembersCount: member.familyMembersCount || 0,
        role: member.role || 'User', // Default role
        status: member.status || 'Active', // Default status
        mayyathuStatus: member.mayyathuStatus || false, // Default mayyathu status
        createdAt: member.createdAt || 'N/A',
        lastLogin: member.lastLogin || null
      }));

      console.log('Mapped users data:', mappedUsersData);

      if (page === 1) {
        setUsers(mappedUsersData);
      } else {
        setUsers(prevUsers => [...prevUsers, ...mappedUsersData]);
      }

      // Determine if there are more users to load
      setHasMore(paginatedUsers.length === pageSize);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      if (page === 1) {
        setUsers([]); // Ensure users is an array even if there's an error
      }
    } finally {
      if (page === 1) {
        setLoading(false);
      }
      setLoadingMore(false);
    }
  };

  const loadMoreUsers = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUsers(nextPage);
    }
  };

  // Filter users based on search term and additional filters
  const filteredUsers = users && Array.isArray(users) ? users.filter(user => {
    // Apply search term filter
    const matchesSearch = !searchTerm || (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply role filter
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase().includes(roleFilter.toLowerCase());

    // Apply status filter
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase().includes(statusFilter.toLowerCase());

    return matchesSearch && matchesRole && matchesStatus;
  }) : [];

  // Handle scroll for infinite loading on mobile
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        // Check for both container and window scroll
        let atBottom = false;

        // Check container scroll
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          atBottom = scrollHeight - scrollTop <= clientHeight + 200;
        }

        // If container isn't scrollable, check window
        if (!atBottom && screens.xs) {
          const scrollY = window.scrollY || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          atBottom = documentHeight - scrollY <= windowHeight + 200;
        }

        if (atBottom && !loadingMore && hasMore) {
          loadMoreUsers();
        }

        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also listen to container scroll if it exists
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadingMore, hasMore, screens.xs, currentPage]); // Remove filteredUsers from dependencies to prevent excessive re-runs

  // Update search term to filter users client-side
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  // Handle edit button click
  const handleEditUser = (user: any) => {
    setEditingUser(user);
    userForm.setFieldsValue({
      fullName: user.name,
      age: user.age || null,
      phone: user.phone,
      adharNumber: user.adharNumber,
      // Don't set registrationNumber in the form as it's read-only
      houseType: user.houseType,
      familyMembersCount: user.familyMembersCount,
      mayyathuStatus: user.mayyathuStatus,
    });
    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    try {
      // Call the API to delete the user
      await apiService.deleteUser(userId);

      // Update the user list
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to delete user';
      toast.error(errorMsg);
    }
  };


  // Handle mayyathu status update after confirmation
  const handleConfirmMayyathuStatus = async () => {
    if (!selectedUserForMayyathu || !adminName.trim()) {
      toast.error('Please enter administrator name');
      return;
    }

    try {
      // Call the API to toggle mayyathu status
      const newStatus = !selectedUserForMayyathu.mayyathuStatus;
      const response = await apiService.toggleMayyathuStatus(selectedUserForMayyathu.id, newStatus);

      // Update the user list
      const updatedUsers = users.map(u =>
        u.id === selectedUserForMayyathu.id
          ? {
              ...u,
              mayyathuStatus: newStatus // Updated status
            }
          : u
      );

      setUsers(updatedUsers);

      toast.success(`User ${newStatus ? 'added to' : 'removed from'} Mayyathu Fund community by ${adminName}`);

      // Track activity
      await trackActivity('mayyathu_status_change', {
        userId: selectedUserForMayyathu.id,
        userName: selectedUserForMayyathu.name,
        action: newStatus ? 'added' : 'removed',
        adminName: adminName,
        timestamp: new Date().toISOString()
      });

      setShowMayyathuModal(false);
      setAdminName('');
      setSelectedUserForMayyathu(null);
    } catch (error: any) {
      console.error('Error updating mayyathu status:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update mayyathu status';
      toast.error(errorMsg);
      setShowMayyathuModal(false);
      setAdminName('');
      setSelectedUserForMayyathu(null);
    }
  };

  // Function to track activity
  const trackActivity = async (action: string, details: any) => {
    try {
      const activityLog = {
        action,
        details,
        timestamp: new Date().toISOString()
      };

      // In a real app, you would send this to an activity log API
      // For now, we'll store in localStorage
      const existingLogs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
      existingLogs.unshift(activityLog);
      // Keep only the last 100 logs
      if (existingLogs.length > 100) {
        existingLogs.length = 100;
      }
      localStorage.setItem('activityLogs', JSON.stringify(existingLogs));
    } catch (err) {
      console.error('Error tracking activity:', err);
    }
  };

  // Handle form submission to update user
  const handleUpdateUser = async (values: any) => {
    try {
      // Prepare the data in the format expected by the Member API
      // Don't include registrationNumber in update as it's auto-generated
      const updateData = {
        fullName: values.fullName,
        age: values.age,
        phone: values.phone,
        adharNumber: values.adharNumber,
        // Exclude registrationNumber as it's auto-generated
        houseType: values.houseType,
        familyMembersCount: editingUser.familyMembersCount || values.familyMembersCount,
        mayyathuStatus: values.mayyathuStatus, // Include mayyathu status
        familyMembers: editingUser.familyMembers || [] // Include updated family members
      };

      // Call the API to update the user
      const response = await apiService.updateUser(editingUser.id, updateData);

      // Update the user in the local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                ...updateData
              }
            : user
        )
      );

      setShowEditModal(false);
      setEditingUser(null);
      setShowFamilyPreviewModal(false);
      userForm.resetFields();
      toast.success(response.message || 'Member updated successfully');
    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update member';
      toast.error(errorMsg);
    }
  };

  // Define columns for TanStack React Table
  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'registrationNumber',
        header: 'Registration No.',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'houseType',
        header: 'House Type',
        cell: info => info.getValue(),
      },
      {
        accessorFn: row => row.familyMembersCount,
        id: 'familyMembers',
        header: 'Family',
        cell: info => {
          const record = info.row.original;
          const familyMembers = record.familyMembers || [];
          const count = record.familyMembersCount || familyMembers.length || 0;

          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tag color={count > 4 ? 'geekblue' : 'green'}>{count}</Tag>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setEditingUser(record);
                  setShowFamilyPreviewModal(true);
                }}
                style={{ padding: '0 4px' }}
                title="Preview family members"
              >
                <EyeOutlined />
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: info => (
          <Tag color={info.getValue() === 'Admin' ? 'volcano' : 'blue'}>
            {info.getValue() as string}
          </Tag>
        ),
      },
      {
        id: 'mayyathuStatus',
        header: 'Mayyathu Fund',
        cell: info => {
          const record = info.row.original;
          return (
            <Space>
              <Tag
                color={record.mayyathuStatus ? 'gold' : 'default'}
                style={{ textTransform: 'capitalize' }}
              >
                {record.mayyathuStatus ? 'Member' : 'Not Member'}
              </Tag>
              <Button
                size="small"
                type="text"
                icon={record.mayyathuStatus ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
                onClick={() => {
                  setSelectedUserForMayyathu(record);
                  // Clear the admin name field to force manual input
                  setAdminName('');
                  setShowMayyathuModal(true);
                }}
                style={{
                  color: record.mayyathuStatus ? '#ff4d4f' : '#52c41a',
                  padding: '0 8px'
                }}
              >
                {record.mayyathuStatus ? 'Remove' : 'Add'}
              </Button>
            </Space>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => (
          <Tag color={info.getValue() === 'Active' ? 'green' : 'default'}>
            {info.getValue() as string}
          </Tag>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const record = info.row.original;
          return (
            <Space size="middle">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditUser(record)}
                style={{ padding: '0 4px' }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Are you sure you want to delete this user?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDeleteUser(record.id)}
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
          );
        },
      },
    ],
    []
  );

  // Create TanStack React Table instance
  const table = useReactTable({
    data: filteredUsers as User[],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  // Create a function to render mobile card view
  const renderMobileCards = (usersToRender: any[]) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {usersToRender.map((user) => (
          <Card
            key={user.id}
            style={{
              width: '100%',
              margin: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
            styles={{ body: { padding: '16px' } }}
            actions={[
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditUser(user)}
              >
                Edit
              </Button>,
              <Popconfirm
                title="Are you sure you want to delete this user?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDeleteUser(user.id)}
              >
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>
            ]}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, marginRight: '10px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                  {user.name}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Registration:</strong> {user.registrationNumber}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>Phone:</strong> {user.phone}
                </div>
                <div style={{ marginBottom: '4px' }}>
                  <strong>House Type:</strong> {user.houseType}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  <Tag color={user.status === 'Active' ? 'green' : 'default'}>
                    {user.status}
                  </Tag>
                  <Tag color={user.role === 'Admin' ? 'volcano' : 'blue'}>
                    {user.role}
                  </Tag>
                  <Tag color={user.familyMembersCount > 4 ? 'geekblue' : 'green'}>
                    {user.familyMembersCount} Family
                  </Tag>
                  <Tag
                    color={user.mayyathuStatus ? 'gold' : 'default'}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {user.mayyathuStatus ? 'Mayyathu' : 'Not Mayyathu'}
                  </Tag>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <Button
                    size="small"
                    type="text"
                    icon={user.mayyathuStatus ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
                    onClick={() => {
                      setSelectedUserForMayyathu(user);
                      // Clear the admin name field to force manual input
                      setAdminName('');
                      setShowMayyathuModal(true);
                    }}
                    style={{
                      color: user.mayyathuStatus ? '#ff4d4f' : '#52c41a',
                      padding: '0 8px'
                    }}
                  >
                    {user.mayyathuStatus ? 'Remove' : 'Add to'} Mayyathu
                  </Button>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                {user.familyMembers && user.familyMembers.length > 0 && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setEditingUser(user);
                      setShowFamilyPreviewModal(true);
                    }}
                    icon={<EyeOutlined />}
                    title="Preview family members"
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          margin: '20px 20px 0 20px',
          flexWrap: 'wrap' as const
        }}>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            size="middle"
            allowClear
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="middle"
            style={{ backgroundColor: '#0D6D3F', borderColor: '#0D6D3F' }}
            onClick={() => navigate('/add-user')}
          >
            Add User
          </Button>
        </div>

        <Card
          title={
            <Title level={3} style={{ margin: 0, color: '#0D6D3F' }}>
              User List
            </Title>
          }
          style={{ margin: '20px' }}
        >
          {/* Filters */}
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by Role"
                value={roleFilter}
                onChange={(value) => setRoleFilter(value)}
                style={{ width: '100%' }}
                size="middle"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                <Option value="all">All Roles</Option>
                <Option value="Admin">Admin</Option>
                <Option value="User">User</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: '100%' }}
                size="middle"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                <Option value="all">All Status</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="default"
                style={{ width: '100%', border: '1px solid #d9d9d9' }}
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
                size="middle"
              >
                Clear Filters
              </Button>
            </Col>
          </Row>

          {/* Modern Ant Design Table */}
          <Table
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: filteredUsers.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 800 }}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
              },
              {
                title: 'Registration No.',
                dataIndex: 'registrationNumber',
                key: 'registrationNumber',
                sorter: (a, b) => a.registrationNumber.localeCompare(b.registrationNumber),
              },
              {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
              },
              {
                title: 'House Type',
                dataIndex: 'houseType',
                key: 'houseType',
              },
              {
                title: 'Family',
                key: 'familyMembers',
                render: (_, record) => {
                  const familyMembers = record.familyMembers || [];
                  const count = record.familyMembersCount || familyMembers.length || 0;

                  return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tag color={count > 4 ? 'geekblue' : 'green'}>{count}</Tag>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => {
                          setEditingUser(record);
                          setShowFamilyPreviewModal(true);
                        }}
                        style={{ padding: '0 4px' }}
                        title="Preview family members"
                      >
                        <EyeOutlined />
                      </Button>
                    </div>
                  );
                },
              },
              {
                title: 'Role',
                dataIndex: 'role',
                key: 'role',
                sorter: (a, b) => a.role.localeCompare(b.role),
                render: (role) => (
                  <Tag color={role === 'Admin' ? 'volcano' : 'blue'}>
                    {role}
                  </Tag>
                ),
              },
              {
                title: 'Mayyathu Fund',
                key: 'mayyathuStatus',
                render: (_, record) => (
                  <Space>
                    <Tag
                      color={record.mayyathuStatus ? 'gold' : 'default'}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {record.mayyathuStatus ? 'Member' : 'Not Member'}
                    </Tag>
                    <Button
                      size="small"
                      type="text"
                      icon={record.mayyathuStatus ? <MinusCircleOutlined /> : <PlusCircleOutlined />}
                      onClick={() => {
                        setSelectedUserForMayyathu(record);
                        // Clear the admin name field to force manual input
                        setAdminName('');
                        setShowMayyathuModal(true);
                      }}
                      style={{
                        color: record.mayyathuStatus ? '#ff4d4f' : '#52c41a',
                        padding: '0 8px'
                      }}
                    >
                      {record.mayyathuStatus ? 'Remove' : 'Add'}
                    </Button>
                  </Space>
                ),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                sorter: (a, b) => a.status.localeCompare(b.status),
                render: (status) => (
                  <Tag color={status === 'Active' ? 'green' : 'default'}>
                    {status}
                  </Tag>
                ),
              },
              {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                  <Space size="middle">
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => handleEditUser(record)}
                      style={{ padding: '0 4px' }}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete this user?"
                      okText="Yes"
                      cancelText="No"
                      onConfirm={() => handleDeleteUser(record.id)}
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
            ]}
            rowClassName={(record, index) =>
              index % 2 === 0 ? (isDarkMode ? 'dark-row-even' : 'light-row-even') : (isDarkMode ? 'dark-row-odd' : 'light-row-odd')
            }
          />
        </Card>

        {/* Mayyathu Confirmation Modal */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserAddOutlined style={{ color: selectedUserForMayyathu?.mayyathuStatus ? '#ff4d4f' : '#52c41a' }} />
              <span>{selectedUserForMayyathu?.mayyathuStatus ? 'Remove' : 'Add'} User to Mayyathu Fund</span>
            </div>
          }
          open={showMayyathuModal}
          onCancel={() => {
            setShowMayyathuModal(false);
            setAdminName('');
            setSelectedUserForMayyathu(null);
          }}
          onOk={handleConfirmMayyathuStatus}
          okText={selectedUserForMayyathu?.mayyathuStatus ? 'Remove' : 'Add'}
          cancelText="Cancel"
          okButtonProps={{
            style: {
              backgroundColor: selectedUserForMayyathu?.mayyathuStatus ? '#ff4d4f' : '#52c41a',
              borderColor: selectedUserForMayyathu?.mayyathuStatus ? '#ff4d4f' : '#52c41a'
            }
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <strong>User:</strong> {selectedUserForMayyathu?.name} (Registration: {selectedUserForMayyathu?.registrationNumber})
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong>Action:</strong> {selectedUserForMayyathu?.mayyathuStatus ? 'Remove from' : 'Add to'} Mayyathu Fund
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              <strong>Administrator Name:</strong>
            </label>
            <Input
              placeholder="Enter your name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              size="large"
            />
          </div>
        </Modal>

        {/* Edit User Modal - Similar to AddUser form */}
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EditOutlined style={{ color: '#0D6D3F' }} />
              <span>Edit Member</span>
            </div>
          }
          open={showEditModal}
          onCancel={() => {
            setShowEditModal(false);
            setEditingUser(null);
            userForm.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={userForm}
            layout="vertical"
            onFinish={handleUpdateUser}
            initialValues={{
              fullName: '',
              age: null,
              phone: '',
              adharNumber: '',
              registrationNumber: '',
              houseType: '',
              familyMembersCount: 1
            }}
          >
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <Card size="small" title="Personal Information">
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
                      { pattern: /^\d{10}$/, message: 'Please enter a 10-digit phone number' },
                      { min: 10, message: 'Phone number must be 10 digits' },
                      { max: 10, message: 'Phone number must be 10 digits' }
                    ]}
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>

                  <Form.Item
                    name="adharNumber"
                    label="Aadhaar Number"
                    rules={[
                      { required: true, message: 'Please enter Aadhaar number' },
                      { pattern: /^\d{12}$/, message: 'Please enter a 12-digit Aadhaar number' },
                      { min: 12, message: 'Aadhaar number must be 12 digits' },
                      { max: 12, message: 'Aadhaar number must be 12 digits' }
                    ]}
                  >
                    <Input placeholder="Enter Aadhaar number" />
                  </Form.Item>

                  <Form.Item
                    name="registrationNumber"
                    label="Registration Number"
                  >
                    <Input placeholder="Enter registration number" disabled />
                  </Form.Item>
                </Card>
              </div>

              <div style={{ flex: 1 }}>
                <Card size="small" title="House & Family Information">
                  <Form.Item
                    name="houseType"
                    label="House Type"
                    rules={[{ required: true, message: 'Please select house type' }]}
                  >
                    <Input placeholder="Enter house type" />
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

                  <Form.Item
                    name="mayyathuStatus"
                    label="Mayyathu Fund Member"
                    valuePropName="checked"
                  >
                    <Checkbox>
                      Member of Mayyathu Fund Community
                    </Checkbox>
                  </Form.Item>
                </Card>
              </div>
            </div>

            {/* Family Members Section in Edit Modal */}
            <Card
              title="Family Members Details"
              size="small"
              style={{ marginTop: '16px' }}
            >
              {editingUser?.familyMembers && editingUser.familyMembers.length > 0 ? (
                <div>
                  {editingUser.familyMembers.map((member: any, index: number) => (
                    <div key={index} style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      marginBottom: '8px',
                      padding: '8px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px'
                    }}>
                      <div style={{ flex: 2 }}>
                        <Input
                          placeholder="Name"
                          value={member.name}
                          onChange={(e) => {
                            const updatedMembers = [...editingUser.familyMembers];
                            updatedMembers[index].name = e.target.value;
                            setEditingUser({
                              ...editingUser,
                              familyMembers: updatedMembers
                            });
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <Input
                          placeholder="Relation"
                          value={member.relation}
                          onChange={(e) => {
                            const updatedMembers = [...editingUser.familyMembers];
                            updatedMembers[index].relation = e.target.value;
                            setEditingUser({
                              ...editingUser,
                              familyMembers: updatedMembers
                            });
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <InputNumber
                          placeholder="Age"
                          value={member.age}
                          onChange={(value) => {
                            const updatedMembers = [...editingUser.familyMembers];
                            updatedMembers[index].age = value;
                            setEditingUser({
                              ...editingUser,
                              familyMembers: updatedMembers
                            });
                          }}
                          style={{ width: '100%' }}
                        />
                      </div>

                      <Button
                        type="text"
                        danger
                        onClick={() => {
                          const updatedMembers = editingUser.familyMembers.filter((_: any, i: number) => i !== index);
                          setEditingUser({
                            ...editingUser,
                            familyMembers: updatedMembers,
                            familyMembersCount: updatedMembers.length
                          });
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => {
                      const newMember = { name: '', relation: '', age: null };
                      setEditingUser({
                        ...editingUser,
                        familyMembers: [...editingUser.familyMembers, newMember],
                        familyMembersCount: editingUser.familyMembers.length + 1
                      });
                    }}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    Add Family Member
                  </Button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      const newMember = { name: '', relation: '', age: null };
                      setEditingUser({
                        ...editingUser,
                        familyMembers: [newMember],
                        familyMembersCount: 1
                      });
                    }}
                    style={{ width: '100%' }}
                  >
                    Add Family Member
                  </Button>
                </div>
              )}
            </Card>

            <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    userForm.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  Update Member
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Family Members Preview Modal */}
        <Modal
          title="Family Members Details"
          open={showFamilyPreviewModal}
          onCancel={() => setShowFamilyPreviewModal(false)}
          footer={[
            <Button key="close" onClick={() => setShowFamilyPreviewModal(false)}>
              Close
            </Button>
          ]}
          width={600}
        >
          {editingUser?.familyMembers && editingUser.familyMembers.length > 0 ? (
            <div>
              {editingUser.familyMembers.map((member: any, index: number) => (
                <Card
                  key={index}
                  size="small"
                  style={{ marginBottom: '12px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div><strong>{member.name}</strong></div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {member.relation} • Age: {member.age}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No family members information available
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
};

export default UserManagementPage;