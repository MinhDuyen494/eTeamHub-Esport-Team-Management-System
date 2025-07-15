import React, { useState } from 'react';
import { Table, Tag, Typography, Button, Modal } from 'antd';

const { Title } = Typography;

// Mock data players (bao gồm cả player tự do và player trong team)
const mockPlayers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    nickname: 'Ace',
    team: 'Team Alpha',
    role: 'Đội trưởng',
    email: 'ace@example.com',
    phone: '0901234567',
    joinDate: '2023-01-10',
    events: [
      {
        id: 101,
        title: 'Giải đấu mùa xuân',
        type: 'Thi đấu',
        date: '2024-06-05',
        role: 'Tạo',
      },
      {
        id: 102,
        title: 'Luyện tập chiến thuật',
        type: 'Luyện tập',
        date: '2024-06-10',
        role: 'Tham gia',
      },
    ],
  },
  {
    id: 2,
    name: 'Trần Thị B',
    nickname: 'Blaze',
    team: 'Team Bravo',
    role: 'Thành viên',
    email: 'blaze@example.com',
    phone: '0902345678',
    joinDate: '2023-02-15',
    events: [
      {
        id: 103,
        title: 'Giải đấu mùa hè',
        type: 'Thi đấu',
        date: '2024-06-15',
        role: 'Tham gia',
      },
    ],
  },
  {
    id: 3,
    name: 'Lê Văn C',
    nickname: 'Clutch',
    team: 'Team Alpha',
    role: 'Thành viên',
    email: 'clutch@example.com',
    phone: '0903456789',
    joinDate: '2023-03-20',
    events: [
      {
        id: 102,
        title: 'Luyện tập chiến thuật',
        type: 'Luyện tập',
        date: '2024-06-10',
        role: 'Tham gia',
      },
    ],
  },
  {
    id: 4,
    name: 'Phạm Văn D',
    nickname: 'Dino',
    team: '', // Player tự do
    role: 'Player tự do',
    email: 'dino@example.com',
    phone: '0904567890',
    joinDate: '2023-04-05',
    events: [],
  },
];

const eventColumns = [
  {
    title: 'Tên sự kiện',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => (
      <Tag color={type === 'Thi đấu' ? 'blue' : 'green'}>{type}</Tag>
    ),
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
  },
  {
    title: 'Vị trí trong team',
    dataIndex: 'role',
    key: 'role',
    render: (role: string) => (
      <Tag color={role === 'Tạo' ? 'gold' : 'default'}>{role}</Tag>
    ),
  },
];

// Hàm tạo màu cố định từ tên team
function getTeamColor(team: string): string {
  if (!team) return 'magenta'; // Tự do
  // Danh sách màu đẹp, đủ dùng cho nhiều team
  const colors = [
    'geekblue', 'volcano', 'cyan', 'gold', 'lime', 'purple', 'orange', 'green', 'blue', 'red', 'yellow', 'pink', 'teal', 'brown', 'gray', 'processing', 'success', 'warning', 'error',
  ];
  // Hash tên team thành số
  let hash = 0;
  for (let i = 0; i < team.length; i++) {
    hash = team.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 60,
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Nickname',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: 'Team',
    dataIndex: 'team',
    key: 'team',
    render: (team: string) => (
      <Tag color={getTeamColor(team)} style={{ fontWeight: 'bold', fontSize: 15 }}>
        {team ? team : 'Tự do'}
      </Tag>
    ),
  },
  {
    title: 'Vị trí trong team',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Ngày tham gia',
    dataIndex: 'joinDate',
    key: 'joinDate',
    render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
  },
  {
    title: 'Hoạt động',
    key: 'actions',
    render: (_: any, record: any) => (
      <Button type="link" onClick={() => handleShowActivity(record)}>
        Xem hoạt động
      </Button>
    ),
    width: 120,
  },
];

let handleShowActivity: (player: any) => void = () => {};

const PlayersPage: React.FC = () => {
  const [activityModal, setActivityModal] = useState<{visible: boolean, player: any | null}>({visible: false, player: null});

  handleShowActivity = (player: any) => {
    setActivityModal({ visible: true, player });
  };

  return (
    <div style={{ padding: 32 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Danh sách thành viên</Title>
      <Table
        columns={columns}
        dataSource={mockPlayers}
        rowKey="id"
        bordered
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title={activityModal.player ? `Hoạt động của ${activityModal.player.name} trong tháng` : ''}
        open={activityModal.visible}
        onCancel={() => setActivityModal({visible: false, player: null})}
        footer={null}
        width={700}
      >
        {activityModal.player && (
          <Table
            columns={eventColumns}
            dataSource={activityModal.player.events}
            rowKey="id"
            pagination={false}
            bordered
            locale={{emptyText: 'Không có hoạt động nào trong tháng'}}
          />
        )}
      </Modal>
    </div>
  );
};

export default PlayersPage; 