import React, { useEffect, useState } from 'react';
import { Spin, Empty } from 'antd';
import AdminPlayersPage from './Players/AdminPlayersPage';
import PlayerProfilePage from './Players/PlayerProfilePage';

const PlayersPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return <Empty description="Không tìm thấy thông tin người dùng." style={{ marginTop: 100 }} />;
  }

  // Render component theo role
  if (user.role?.name === 'admin') {
    return <AdminPlayersPage />;
  }



  if (user.role?.name === 'player') {
    return <PlayerProfilePage />;
  }

  return <Empty description={`Không xác định vai trò: ${user.role?.name || 'unknown'}`} style={{ marginTop: 100 }} />;
};

export default PlayersPage; 