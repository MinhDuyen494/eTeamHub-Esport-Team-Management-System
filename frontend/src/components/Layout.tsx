import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Tạo menu items dựa trên role và team membership
  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/dashboard'),
      },
      {
        key: 'teams',
        icon: <TeamOutlined />,
        label: 'Teams',
        onClick: () => navigate('/teams'),
      },
      {
        key: 'events',
        icon: <CalendarOutlined />,
        label: 'Events',
        onClick: () => navigate('/events'),
      },
    ];

    if (user?.role?.name === 'admin' || user?.role?.name === 'player') {
      baseItems.push({
        key: 'players',
        icon: <UserOutlined />,
        label: 'Players',
        onClick: () => navigate('/players'),
      });
    }
    // Thêm Events cho admin hoặc player/leader có team

    // Thêm Users chỉ cho admin
    if (user?.role?.name === 'admin') {
      baseItems.push({
        key: 'users',
        icon: <UserOutlined />,
        label: 'Users',
        onClick: () => navigate('/users'),
      });
    }

    // Thêm Settings cho tất cả
    baseItems.push({
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    });

    return baseItems;
  };



  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: colorBgContainer,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000,
        }}
        width={collapsed ? 80 : 250}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 16
        }}>
          <h2 style={{ 
            margin: 0, 
            color: '#1890ff',
            fontSize: collapsed ? 16 : 20,
            fontWeight: 'bold'
          }}>
            {collapsed ? 'ET' : 'eTeamHub'}
          </h2>
        </div>
        <Menu
          mode="inline"
          style={{ borderRight: 0 }}
          items={getMenuItems()}
        />
        <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: '100%',
              height: 64,
              position: 'absolute',
              bottom: 0,
              textAlign: 'center',
              background: colorBgContainer,
              zIndex: 1000,
              display: 'flex',
            }}
          />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        <Content
          style={{
            padding: '24px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: '100vh',
            transition: 'all 0.2s',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 