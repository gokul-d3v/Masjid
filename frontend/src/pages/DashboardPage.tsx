import React, { useState, useEffect, useMemo } from 'react';
import { Card, Col, Row, Statistic, Divider, Space, Button, message, Modal, Form, Input, InputNumber, Typography } from 'antd';
import { UserOutlined, DollarOutlined, MoneyCollectOutlined, BarChartOutlined, PlusOutlined, RiseOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, PieLabelRenderProps, ComposedChart, Area, BarChart, Bar, Rectangle, DefaultTooltipContent, DefaultLegendContent } from 'recharts';
import { apiService } from '../services/apiService';
import AppLayout from '../components/AppLayout';
import { useTheme } from '../context/ThemeContext';

const { Title, Text } = Typography;

// Custom label rendering for pie chart
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: PieLabelRenderProps & { name: string }) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

// Helper functions for Banded Chart
const renderTooltipWithoutRange = ({ payload, content, ...rest }: any) => {
  const newPayload = payload.filter((x: any) => x.dataKey !== 'a');
  return <DefaultTooltipContent payload={newPayload} {...rest} />;
};

const renderLegendWithoutRange = ({ payload, content, ref, ...rest }: any) => {
  const newPayload = payload?.filter((x: any) => x.dataKey !== 'a');
  return <DefaultLegendContent payload={newPayload} {...rest} />;
};

// Define custom card component with Berry style
const BerryCard = ({ title, value, icon, color, trend, children, ...props }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Card
      style={{
        borderRadius: '12px',
        boxShadow: isDarkMode 
          ? '0 2px 10px rgba(0, 0, 0, 0.4)' 
          : '0 2px 10px rgba(0, 0, 0, 0.05)',
        border: 'none',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      bodyStyle={{ padding: '20px' }}
      hoverable
      {...props}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={5} style={{ margin: 0, fontSize: '14px', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
            {title}
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <Text style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              color: isDarkMode ? '#f1f5f9' : '#1e293b',
              marginRight: '8px'
            }}>
              {value}
            </Text>
            {trend && (
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 600, 
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: trend > 0 ? (isDarkMode ? '#166534' : '#dcfce7') : (isDarkMode ? '#7f1d1d' : '#fee2e2'),
                color: trend > 0 ? (isDarkMode ? '#4ade80' : '#16a34a') : (isDarkMode ? '#fca5a5' : '#dc2626'),
              }}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8
        }}>
          {icon}
        </div>
      </div>
      {children && <div style={{ marginTop: '16px' }}>{children}</div>}
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [collectionForm] = Form.useForm();
  const { isDarkMode } = useTheme();

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch dashboard stats - runs only once when component mounts
  useEffect(() => {
    if (hasLoaded) return; // Don't fetch again if already loaded

    let isMounted = true;
    setLoading(true); // Set loading to true on initial load

    const fetchDashboardData = async () => {
      try {
        const statsResponse = await apiService.getDashboardStats();

        if (isMounted) {
          setStats(statsResponse);
          setHasLoaded(true); // Mark as loaded to prevent future fetches

          // Fetch recent activities from the backend API
          const activitiesResponse = await apiService.getRecentActivities();
          setRecentActivities(activitiesResponse.slice(0, 5)); // Show only top 5 activities

          // Create payment history based on recent collections from stats
          const collections = statsResponse.recentCollections || [];
          const payments = collections.slice(0, 5).map((collection: any) => ({
            id: collection.id,
            amount: collection.amount,
            type: collection.category || collection.description || 'General',
            date: collection.collectedDate ? new Date(collection.collectedDate).toLocaleDateString() : new Date().toLocaleDateString(),
            collectedBy: collection.collectedBy || collection.collectedBy?.name || 'Admin'
          }));
          setPaymentHistory(payments);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (isMounted) {
          message.error('Failed to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setLoading(false); // Set loading to false after data is fetched
        }
      }
    };

    fetchDashboardData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [hasLoaded]); // Only re-run if hasLoaded changes from false to true

  // Reload stats after adding a collection
  const reloadStats = async () => {
    try {
      setLoading(true); // Show loading during reload
      const response = await apiService.getDashboardStats();
      setStats(response); // Always update to reflect the latest data

      // Refresh related data as well
      const activitiesResponse = await apiService.getRecentActivities();
      setRecentActivities(activitiesResponse.slice(0, 5)); // Show only top 5 activities

      // Refresh payment history based on new stats
      const collections = response.recentCollections || [];
      const payments = collections.slice(0, 5).map((collection: any) => ({
        id: collection.id,
        amount: collection.amount,
        type: collection.category || collection.description || 'General',
        date: collection.collectedDate ? new Date(collection.collectedDate).toLocaleDateString() : new Date().toLocaleDateString(),
        collectedBy: collection.collectedBy || collection.collectedBy?.name || 'Admin'
      }));
      setPaymentHistory(payments);

      message.success('Collection added successfully');
    } catch (error: any) {
      console.error('Error reloading stats:', error);
      message.error(error.response?.data?.error || 'Failed to reload dashboard data');
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  // Handle adding new collection
  const handleAddCollection = async (values: any) => {
    try {
      await apiService.addMoneyCollection(values);
      reloadStats();
      setShowAddCollectionModal(false);
      collectionForm.resetFields();
    } catch (error: any) {
      console.error('Error adding collection:', error);
      message.error(error.response?.data?.error || 'Failed to add collection');
    }
  };

  // Prepare data for Mayyathu Fund and Monthly Collection line chart
  const mayyathuAndMonthlyData = (stats?.monthlyCollections || []).slice(0, 7).map((item: any) => ({
    name: `${item._id?.month || 'M'}${item._id?.year?.toString().substring(2) || ''}`, // Month-Year format (e.g., 'Jan 24')
    mayyathuFund: item.mayyathuFund || Math.round((stats?.mayyathuFundCollected || 0) / Math.max(1, (stats?.monthlyCollections || []).length)),
    monthlyCollection: item.total || item.monthlyDonations || 0
  }));

  // If we don't have detailed monthly collections, create a synthetic dataset
  if (mayyathuAndMonthlyData.length === 0) {
    for (let i = 0; i < 7; i++) {
      mayyathuAndMonthlyData.push({
        name: `Month ${i + 1}`,
        mayyathuFund: Math.round((stats?.mayyathuFundCollected || 0) / 7),
        monthlyCollection: Math.round((stats?.monthlyDonationsCollected || 0) / 7)
      });
    }
  }


  // Define colors based on theme
  const primaryColor = isDarkMode ? '#34d399' : '#10b981';
  const secondaryColor = isDarkMode ? '#60a5fa' : '#3b82f6';
  const accentColor = isDarkMode ? '#f59e0b' : '#f59e0b';
  const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const bgColor = isDarkMode ? '#0f172a' : '#f8fafc';
  const cardBgColor = isDarkMode ? '#1e293b' : '#ffffff';

  // State to track selected year for monthly collections
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    // Default to current year or the year of the first monthly collection if available
    const currentYear = new Date().getFullYear().toString();
    if (stats?.monthlyCollections && stats.monthlyCollections.length > 0) {
      const firstCollectionYear = stats.monthlyCollections[0]._id?.year;
      if (firstCollectionYear) return firstCollectionYear.toString();
    }
    return currentYear;
  });

  // Generate year options based on available data
  const yearOptions = useMemo(() => {
    if (stats?.monthlyCollections) {
      // Extract unique years from the monthly collections
      const years = [...new Set(stats.monthlyCollections.map((item: any) => item._id?.year))];
      return years.sort((a, b) => parseInt(b) - parseInt(a)); // Sort in descending order
    }
    // If no data, use current year and a couple of previous years
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2].map(year => year.toString());
  }, [stats]);

  // Filter monthly collections by selected year
  const monthlyDataForYear = stats?.monthlyCollections?.filter((item: any) =>
    item._id?.year?.toString() === selectedYear
  ) || [];

  // Create data for simple bar chart with months and amounts
  const simpleBarChartData = monthlyDataForYear.map((item: any) => ({
    name: `${item._id?.month || 'Month'}`,
    amount: item.total || 0,
  }));

  // If we don't have data for the selected year, or no data at all, create a dummy dataset
  if (simpleBarChartData.length === 0) {
    // Create months 1-12 with 0 amounts
    for (let i = 1; i <= 12; i++) {
      simpleBarChartData.push({
        name: `Month ${i}`,
        amount: 0,
      });
    }
  }



  return (
    <AppLayout>
      <div style={{ padding: '24px' }}>
        {/* Banner with splash image */}
        <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <img
            src="/Splash.png"
            alt="App Banner"
            style={{
              maxWidth: '280px',
              maxHeight: '280px',
              width: '280px',
              height: '280px',
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.2)',
              border: '5px solid rgba(255, 255, 255, 0.4)',
              background: 'white'
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{
            color: isDarkMode ? '#f1f5f9' : '#1e293b',
            fontWeight: 700,
            marginBottom: '8px'
          }}>
            Dashboard
          </Title>
          <Text style={{ color: isDarkMode ? '#94a3b8' : '#64748b' }}>
            Welcome to your admin panel
          </Text>
        </div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <BerryCard
              title="Total Users"
              value={stats?.totalUsers || 0}
              icon={<UserOutlined style={{ fontSize: '20px', color: '#ffffff' }} />}
              color={isDarkMode ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
              trend={5.2}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <BerryCard
              title="Total Money Collected"
              value={`₹${stats?.totalMoneyCollected ? stats.totalMoneyCollected.toLocaleString() : '0'}`}
              icon={<DollarOutlined style={{ fontSize: '20px', color: '#ffffff' }} />}
              color={isDarkMode ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
              trend={3.8}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <BerryCard
              title="Mayyathu Fund"
              value={`₹${stats?.mayyathuFundCollected ? stats.mayyathuFundCollected.toLocaleString() : '0'}`}
              icon={<MoneyCollectOutlined style={{ fontSize: '20px', color: '#ffffff' }} />}
              color={isDarkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
              trend={7.1}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <BerryCard
              title="Monthly Donations"
              value={`₹${stats?.monthlyDonationsCollected ? stats.monthlyDonationsCollected.toLocaleString() : '0'}`}
              icon={<BarChartOutlined style={{ fontSize: '20px', color: '#ffffff' }} />}
              color={isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.2)'}
              trend={-1.2}
            />
          </Col>
        </Row>

        {/* Line Chart Section - Mayyathu Fund and Monthly Collections */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          {/* Mayyathu Fund and Monthly Collection Chart */}
          <Col xs={24} lg={24}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BarChartOutlined style={{ marginRight: '8px', color: primaryColor }} />
                  <span style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600 }}>Mayyathu Fund vs Monthly Collections</span>
                </div>
              }
              style={{
                borderRadius: '12px',
                boxShadow: isDarkMode
                  ? '0 2px 10px rgba(0, 0, 0, 0.4)'
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
                border: 'none',
                overflow: 'hidden',
                backgroundColor: cardBgColor,
                height: '350px'
              }}
              bodyStyle={{ padding: 0, height: '100%' }}
            >
              <div style={{ padding: '16px', height: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="85%" minHeight={200}>
                  <LineChart
                    data={mayyathuAndMonthlyData}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                      dataKey="name"
                      stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                      tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                      tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                      labelStyle={{ color: isDarkMode ? '#f1f5f9' : '#333', fontWeight: 'bold' }}
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        color: textColor,
                        fontWeight: 'bold'
                      }}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      formatter={(value) => <span style={{ color: textColor, fontSize: '12px', fontWeight: '500' }}>{value}</span>}
                      payload={[
                        { value: 'Mayyathu Fund', type: 'circle', color: primaryColor },
                        { value: 'Monthly Collections', type: 'circle', color: secondaryColor }
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="mayyathuFund"
                      stroke={primaryColor}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="monthlyCollection"
                      stroke={secondaryColor}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Monthly Collection Amount Bar Chart with Year Selector */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={24}>
            <Card
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BarChartOutlined style={{ marginRight: '8px', color: primaryColor }} />
                    <span style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600 }}>Monthly Collections</span>
                  </div>
                  <div>
                    <label htmlFor="year-select" style={{ color: isDarkMode ? '#e2e8f0' : '#334155', marginRight: '8px' }}>
                      Year:
                    </label>
                    <select
                      id="year-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{
                        backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
                        color: isDarkMode ? '#f1f5f9' : '#1e293b',
                        border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                        borderRadius: '6px',
                        padding: '4px 8px',
                      }}
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              }
              style={{
                borderRadius: '12px',
                boxShadow: isDarkMode
                  ? '0 2px 10px rgba(0, 0, 0, 0.4)'
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
                border: 'none',
                overflow: 'hidden',
                backgroundColor: cardBgColor,
                height: '350px'
              }}
              bodyStyle={{ padding: 0, height: '100%' }}
            >
              <div style={{
                padding: '16px',
                height: 'calc(100% - 50px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0
              }}>
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                  <BarChart
                    data={simpleBarChartData}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis
                      dataKey="name"
                      stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                      interval={0} // Show all labels
                    />
                    <YAxis
                      stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                      width="auto"
                      tickFormatter={(value) => `₹${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                      labelStyle={{ color: isDarkMode ? '#f1f5f9' : '#333', fontWeight: 'bold' }}
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        color: textColor,
                        fontWeight: 'bold'
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill={primaryColor}
                      radius={[4, 4, 0, 0]} // Rounded tops for bars
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Recent Collections */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BarChartOutlined style={{ marginRight: '8px', color: primaryColor }} />
                  <span style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600 }}>Recent Collections</span>
                </div>
              }
              style={{
                borderRadius: '12px',
                boxShadow: isDarkMode 
                  ? '0 2px 10px rgba(0, 0, 0, 0.4)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
                border: 'none',
                overflow: 'hidden',
                backgroundColor: cardBgColor,
                height: '300px'
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{
                height: 'calc(100% - 50px)',
                overflow: 'hidden'
              }}>
                {loading ? (
                  <div style={{
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    Loading data...
                  </div>
                ) : (
                  <div style={{
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }} className="hide-scrollbar">
                    {stats?.recentCollections && stats.recentCollections.length > 0 ? (
                      <div>
                        {stats.recentCollections.slice(0, 5).map((item: any, index: number) => (
                          <div
                            key={index}
                            style={{
                              padding: '12px',
                              borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: '600', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                                {item.description}
                              </div>
                              <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                                {new Date(item.collectedDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div style={{ fontWeight: '600', color: isDarkMode ? '#34d399' : '#10b981' }}>
                              ₹{item.amount?.toLocaleString() || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                      }}>
                        No recent collections
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Top Donors Card */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ marginRight: '8px', color: accentColor }} />
                  <span style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600 }}>Top Donors</span>
                </div>
              }
              style={{
                borderRadius: '12px',
                boxShadow: isDarkMode
                  ? '0 2px 10px rgba(0, 0, 0, 0.4)'
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
                border: 'none',
                overflow: 'hidden',
                backgroundColor: cardBgColor,
                height: '300px'
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{
                height: 'calc(100% - 50px)',
                overflow: 'hidden'
              }}>
                {stats?.recentCollections && stats.recentCollections.length > 0 ? (
                  <div style={{
                    height: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }} className="hide-scrollbar">
                    {stats.recentCollections
                      .filter((collection: any) => collection.userId) // Only collections with a user
                      .slice(0, 5) // Take top 5
                      .map((collection: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            padding: '12px',
                            borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '600', color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                              {collection.userId?.fullName || collection.userId?.name || 'Anonymous Donor'}
                            </div>
                            <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                              {collection.category || 'Donation'} • {new Date(collection.collectedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ fontWeight: '600', color: isDarkMode ? '#34d399' : '#10b981' }}>
                            ₹{collection.amount?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDarkMode ? '#94a3b8' : '#64748b'
                  }}>
                    No donor data available
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <Divider style={{ margin: '40px 0', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }} />

        {/* Recent Activities and Payment History Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DollarOutlined style={{ marginRight: '8px', color: primaryColor }} />
                  <span style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600 }}>Recent Activities</span>
                </div>
              }
              style={{
                borderRadius: '12px',
                boxShadow: isDarkMode 
                  ? '0 2px 10px rgba(0, 0, 0, 0.4)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
                border: 'none',
                overflow: 'hidden',
                backgroundColor: cardBgColor
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{
                height: '300px',
                overflow: 'hidden'
              }}>
                {recentActivities && recentActivities.length > 0 ? (
                  <div style={{
                    height: 'calc(100% - 20px)',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }} className="hide-scrollbar">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px',
                          borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                          borderRadius: '6px',
                          margin: '2px 0'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ fontWeight: '600', color: isDarkMode ? '#f0fdf4' : '#1f2937' }}>
                          {activity.action}: ₹{activity.details?.amount?.toLocaleString() || '0'}
                        </div>
                        <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#6b7280' }}>
                          {activity.details?.category || 'General'} • {new Date(activity.timestamp).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e1' : '#9ca3af' }}>
                          Collected by: {activity.details?.collectedBy || 'System'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    No recent activities recorded
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Payment History Section */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyCollectOutlined style={{ marginRight: '8px', color: accentColor }} />
                  <span style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b', fontWeight: 600 }}>Recent Payments</span>
                </div>
              }
              style={{
                borderRadius: '12px',
                boxShadow: isDarkMode 
                  ? '0 2px 10px rgba(0, 0, 0, 0.4)' 
                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
                border: 'none',
                overflow: 'hidden',
                backgroundColor: cardBgColor
              }}
              bodyStyle={{ padding: '16px' }}
            >
              <div style={{
                height: '300px',
                overflow: 'hidden'
              }}>
                {paymentHistory && paymentHistory.length > 0 ? (
                  <div style={{
                    height: 'calc(100% - 20px)',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }} className="hide-scrollbar">
                    {paymentHistory.map((payment, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px',
                          borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                          cursor: 'pointer',
                          transition: 'background-color 0.3s',
                          borderRadius: '6px',
                          margin: '2px 0'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: isDarkMode ? '#f1f5f9' : '#1f2937' }}>
                              ₹{payment.amount?.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', color: isDarkMode ? '#94a3b8' : '#6b7280' }}>
                              {payment.type} • {payment.date}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e1' : '#9ca3af' }}>
                            by {payment.collectedBy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: isDarkMode ? '#94a3b8' : '#64748b' }}>
                    No recent payments recorded
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <Modal
          title="Add New Collection"
          open={showAddCollectionModal}
          onCancel={() => setShowAddCollectionModal(false)}
          footer={null}
          destroyOnHidden
        >
          <Form
            form={collectionForm}
            layout="vertical"
            onFinish={handleAddCollection}
          >
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <Input placeholder="Enter collection description" />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Please enter an amount' }]}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder="Enter amount" 
                min={0}
                prefix="₹"
              />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
            >
              <Input placeholder="Enter category" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 24 }}>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowAddCollectionModal(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">Add Collection</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;