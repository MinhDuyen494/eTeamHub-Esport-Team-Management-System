import React from 'react';
import { Empty } from 'antd';
import TeamsAdmin from './teams_role/TeamsAdmin';
import TeamsLeader from './teams_role/TeamsLeader';
import TeamsPlayer from './teams_role/TeamsPlayer';

const TeamsPage: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  // Nhận cả trường hợp role là object hoặc string
  const role = user?.role?.name;
  
 

  if (!user || !role) {
    return <Empty description="Bạn chưa đăng nhập hoặc không xác định vai trò." style={{ marginTop: 100 }} />;
  }

  if (role === 'admin') {
    return <TeamsAdmin />;
  }
  else if (role === 'leader') {
    return <TeamsLeader />;
  }
  else if (role === 'player') {
    return <TeamsPlayer />;
  }

  return <Empty description={`Vai trò không hợp lệ: ${role}`} style={{ marginTop: 100 }} />;
};

export default TeamsPage;
