import React from 'react';
import { Empty } from 'antd';
import DashboardLeader from './dashboard_role/Dashboard_leader';
import DashboardAdmin from './dashboard_role/Dashboard_admin';
import DashboardPlayer from './dashboard_role/Dashboard_player';

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role.name;

  if (!user) {
    return <Empty description="Không tìm thấy thông tin người dùng." style={{ marginTop: 100 }} />;
  }

  if (role === 'admin') {
    return <DashboardAdmin />;
  }
  if (role === 'leader') {
    return <DashboardLeader />;
  }
  if (role === 'player') {
    return <DashboardPlayer />;
  }

  return <Empty description={`Không xác định vai trò: ${role || 'unknown'}`} style={{ marginTop: 100 }} />;
};

export default Dashboard;
