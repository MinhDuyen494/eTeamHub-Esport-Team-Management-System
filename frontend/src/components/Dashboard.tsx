import React from 'react';
import { Empty, Button } from 'antd';
import DashboardLeader from './dashboard_role/Dashboard_leader';
import DashboardAdmin from './dashboard_role/Dashboard_admin';
import DashboardPlayer from './dashboard_role/Dashboard_player';
import FreeAgentDashboard from './dashboard_role/FreeAgentDashboard';

const CreatePlayerProfilePrompt = () => (
  <div style={{ textAlign: 'center', marginTop: 100 }}>
    <Empty description="Bạn chưa có hồ sơ tuyển thủ" />
    <Button type="primary" style={{ marginTop: 24 }} onClick={() => window.location.href = '/players/create'}>
      Tạo hồ sơ tuyển thủ
    </Button>
  </div>
);

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role?.name;

  if (!user) {
    return <Empty description="Không tìm thấy thông tin người dùng." style={{ marginTop: 100 }} />;
  }

  if (user && user.role) {
    if (role === 'admin') {
      return <DashboardAdmin />;
    }
    if (role === 'leader') {
      return <DashboardLeader />;
    }
    if (role === 'player') {
      if (!user.player) {
        // Chưa có hồ sơ tuyển thủ
        return <CreatePlayerProfilePrompt />;
      }
      if (user.player?.team) {
        return <DashboardPlayer />;
      } else {
        return <FreeAgentDashboard />;
      }
    }
  }

  return <Empty description={`Không xác định vai trò: ${role || 'unknown'}`} style={{ marginTop: 100 }} />;
};

export default Dashboard;
