import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Button, Empty, Modal } from 'antd';

const { Title } = Typography;

// Mock leader user
const mockLeader = {
  id: 10,
  fullName: 'Leader Nguyễn',
  team: {
    id: 1,
    name: 'Team Alpha',
    members: [
      { id: 1, name: 'Nguyễn Văn A', ign: 'Ace', role: 'Đội trưởng', email: 'ace@example.com' },
      { id: 3, name: 'Lê Văn C', ign: 'Clutch', role: 'Thành viên', email: 'clutch@example.com' },
    ],
  },
};

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'IGN', dataIndex: 'ign', key: 'ign' },
  { title: 'Vị trí', dataIndex: 'role', key: 'role' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
];

const LeaderPlayersPage: React.FC = () => {
  // Giả lập lấy user từ localStorage
  const [leader, setLeader] = useState<any>(null);
  useEffect(() => {
    // Thay bằng lấy user thật và fetch team thật nếu có
    setLeader(mockLeader);
  }, []);

  if (!leader?.team) {
    return (
      <div style={{ padding: 32 }}>
        <Empty description="Bạn chưa có team nào!" />
        <Button type="primary" style={{ marginTop: 16 }}>Tạo team mới</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <Title level={2}>Thành viên team: {leader.team.name}</Title>
      <Table columns={columns} dataSource={leader.team.members} rowKey="id" bordered pagination={false} />
    </div>
  );
};

export default LeaderPlayersPage; 