import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, theme as antdTheme } from 'antd';
import { MenuOutlined, DashboardOutlined, UserOutlined, MoneyCollectOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useAuthStore from '../store/authStore';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const location = useLocation();

  const {
    token: { borderRadiusLG },
  } = antdTheme.useToken();

  // Define menu items
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link to="/users">Members</Link>,
    },
    {
      key: '/collections',
      icon: <MoneyCollectOutlined />,
      label: <Link to="/collections">Collections</Link>,
    },
    {
      key: '/donations',
      icon: <BarChartOutlined />,
      label: <Link to="/donations">Donations</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => handleLogout()
    },
  ];

  const handleLogout = () => {
    const { logout } = useAuthStore.getState();
    logout();
    // The ProtectedRoute will handle redirecting to login page
  };

  // Determine active menu item based on current path
  const getActiveKey = () => {
    // Exact matches first
    if (menuItems.some(item => item.key === location.pathname)) {
      return location.pathname;
    }

    // Check for sub-menu items
    for (const item of menuItems) {
      if (item.children) {
        const subItem = item.children.find((sub: any) => sub.key === location.pathname);
        if (subItem) {
          return location.pathname;
        }
      }
    }

    // Default to dashboard
    return '/';
  };

  const activeKey = getActiveKey();

  return (
    <Layout style={{ minHeight: '100vh', background: isDarkMode ? '#0f172a' : '#f8fafc' }}>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1000,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f1f5f9' : '#1e293b',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          height: 64,
          lineHeight: '64px',
        }}
      >
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileDrawerOpen(true)}
          style={{
            color: isDarkMode ? '#f1f5f9' : '#1e293b',
            fontSize: '16px',
            marginInlineEnd: '16px',
            display: 'none', // Hidden on desktop by default
          }}
          size="large"
          className="mobile-menu-button"
        />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981' }}>
            Kuthiyathode Muslim Jamath Mahallu
          </div>
        </div>
      </Header>

      {/* Desktop Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        onBreakpoint={(broken) => {
          if (broken) {
            // When screen is small, set collapsed state appropriately
            setCollapsed(true);
          } else {
            // When screen is large, allow user preference
          }
        }}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: '64px',
          bottom: 0,
          zIndex: 999,
          background: isDarkMode ? '#1e293b' : '#ffffff',
          borderRight: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        }}
        width={200}
        zeroWidthTriggerStyle={{
          top: '10px',
          right: '-16px',
          background: isDarkMode ? '#1e293b' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          color: isDarkMode ? '#f1f5f9' : '#1e293b',
        }}
      >
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          style={{
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderRight: 'none',
            height: 'calc(100vh - 120px)',
            overflow: 'auto',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: isDarkMode ? '#94a3b8' : '#64748b'
        }}>
          © {new Date().getFullYear()} Kuthiyathode Muslim Jamath Mahallu
        </div>
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={true}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        width={200}
        bodyStyle={{
          padding: 0,
          background: isDarkMode ? '#1e293b' : '#ffffff',
          height: '100%',
        }}
        styles={{
          header: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#f1f5f9' : '#1e293b',
            borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          },
          content: {
            background: isDarkMode ? '#1e293b' : '#ffffff',
          }
        }}
        style={{
          background: isDarkMode ? '#1e293b' : '#ffffff',
        }}
        zIndex={1001}
      >
        <Menu
          theme={isDarkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          style={{
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderRight: 'none',
            height: '100%',
          }}
          onClick={() => setMobileDrawerOpen(false)} // Close drawer when menu item is clicked
        />
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: isDarkMode ? '#94a3b8' : '#64748b'
        }}>
          © {new Date().getFullYear()} Kuthiyathode Muslim Jamath Mahallu
        </div>
      </Drawer>

      <Layout
        style={{
          marginLeft: collapsed ? '80px' : '200px',
          transition: 'margin-left 0.2s',
          marginTop: '64px',
          background: isDarkMode ? '#0f172a' : '#f8fafc',
        }}
      >
        <Content
          style={{
            margin: '24px 16px',
            padding: '24px',
            minHeight: 360,
            background: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: borderRadiusLG,
          }}
        >
          <style>{`
            @media (max-width: 992px) {
              .mobile-menu-button {
                display: block !important;
              }

              .ant-layout-sider {
                display: none !important;
              }

              .ant-layout-has-sider .ant-layout {
                margin-left: 0 !important;
              }

              .ant-layout-content {
                margin: 16px 0 !important;
                padding: 16px !important;
              }

              .ant-layout-header {
                padding: 0 16px !important;
              }
            }

            .scrollable-content {
              overflow-y: auto;
              max-height: 200px;
            }
          `}</style>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;