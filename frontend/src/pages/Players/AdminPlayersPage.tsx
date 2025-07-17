import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Button, Modal, Form, Input, Select, Space, message, Spin, Card, Row, Col, Descriptions, Avatar, Divider } from 'antd';
import { PlusOutlined, UserOutlined, TeamOutlined, CalendarOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { getPlayers } from '../../api/players.api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const eventColumns = [
  { title: 'Tên sự kiện', dataIndex: 'title', key: 'title' },
  { title: 'Loại', dataIndex: 'type', key: 'type', render: (type: string) => <Tag color={type === 'Thi đấu' ? 'blue' : 'green'}>{type}</Tag> },
  { title: 'Ngày', dataIndex: 'date', key: 'date', render: (date: string) => new Date(date).toLocaleDateString('vi-VN') },
  { title: 'Vị trí trong team', dataIndex: 'role', key: 'role', render: (role: string) => <Tag color={role === 'Tạo' ? 'gold' : 'default'}>{role}</Tag> },
];

function getTeamColor(team: string): string {
  if (!team) return 'magenta';
  const colors = ['geekblue', 'volcano', 'cyan', 'gold', 'lime', 'purple', 'orange', 'green', 'blue', 'red', 'yellow', 'pink', 'teal', 'brown', 'gray', 'processing', 'success', 'warning', 'error'];
  let hash = 0;
  for (let i = 0; i < team.length; i++) {
    hash = team.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: 'Tên', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Nickname', dataIndex: 'ign', key: 'ign' },
  { 
    title: 'Team', 
    dataIndex: 'team', 
    key: 'team', 
    render: (team: any) => (
      <Tag color={getTeamColor(team?.name || '')} style={{ fontWeight: 'bold', fontSize: 15 }}>
        {team?.name ? team.name : 'Tự do'}
      </Tag>
    ) 
  },
  { 
    title: 'Vai trò trong game', 
    dataIndex: 'roleInGame', 
    key: 'roleInGame',
    render: (roleInGame: any) => roleInGame?.name || 'Chưa cập nhật'
  },
  { title: 'Tài khoản game', dataIndex: 'gameAccount', key: 'gameAccount' },
  { 
    title: 'Ngày tham gia', 
    dataIndex: 'createdAt', 
    key: 'createdAt', 
    render: (date: string) => dayjs(date).format('DD/MM/YYYY')
  },
  { title: 'Hoạt động', key: 'actions', render: (_: any, record: any) => <Button type="link" onClick={() => handleShowActivity(record)}>Xem hoạt động</Button>, width: 120 },
];

let handleShowActivity: (player: any) => void = () => {};

const AdminPlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityModal, setActivityModal] = useState<{visible: boolean, player: any | null}>({visible: false, player: null});

  handleShowActivity = (player: any) => {
    setActivityModal({ visible: true, player });
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await getPlayers();
      setPlayers(response.players || response || []);
    } catch (error) {
      console.error('Không thể tải danh sách players:', error);
      message.error('Không thể tải danh sách thành viên');
    } finally {
      setLoading(false);
    }
  };

  const activityTableColumns = [
    {
      title: 'Loại hoạt động',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          event: { color: 'blue', icon: <TrophyOutlined />, text: 'Giải đấu' },
          training: { color: 'green', icon: <FireOutlined />, text: 'Luyện tập' },
          meeting: { color: 'orange', icon: <TeamOutlined />, text: 'Họp team' }
        };
        const config = typeConfig[type as keyof typeof typeConfig] || { color: 'default', icon: <UserOutlined />, text: 'Khác' };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: 'Tên hoạt động',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => <Text type="secondary">{description}</Text>
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>
        </Space>
      )
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => (
        <Tag color="gold" style={{ fontWeight: 'bold' }}>
          +{points} điểm
        </Tag>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải danh sách thành viên...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Danh sách thành viên</Title>
      </div>
      <Table 
        columns={columns} 
        dataSource={players} 
        rowKey="id" 
        bordered 
        pagination={{ pageSize: 8 }}
        locale={{
          emptyText: 'Không có thành viên nào'
        }}
      />
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar 
              size={40} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: getTeamColor(activityModal.player?.team?.name || '') }}
            />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {activityModal.player?.fullName}
              </Title>
              <Text type="secondary">
                {activityModal.player?.ign} • {activityModal.player?.team?.name || 'Tự do'}
              </Text>
            </div>
          </div>
        }
        open={activityModal.visible}
        onCancel={() => setActivityModal({visible: false, player: null})}
        footer={null}
        width={800}
        bodyStyle={{ padding: '16px', maxHeight: '70vh' }}
      >
        {activityModal.player && (
          <div>
            {/* Thông tin cơ bản và thống kê gộp chung */}
            <Card style={{ marginBottom: 16, borderRadius: 8 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar 
                      size={60} 
                      icon={<UserOutlined />} 
                      style={{ backgroundColor: getTeamColor(activityModal.player.team?.name || '') }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text strong style={{ fontSize: 14 }}>{activityModal.player.fullName}</Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>{activityModal.player.ign}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={10}>
                  <Descriptions column={1} size="small" style={{ fontSize: 12 }}>
                    <Descriptions.Item label="Team">
                      <Tag color={getTeamColor(activityModal.player.team?.name || '')} style={{ fontWeight: 'bold' }}>
                        {activityModal.player.team?.name || 'Tự do'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Vai trò">
                      <Tag color="blue">{activityModal.player.roleInGame?.name || 'Chưa cập nhật'}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tài khoản game">
                      <Text code style={{ fontSize: 11 }}>{activityModal.player.gameAccount}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tham gia">
                      <Space>
                        <CalendarOutlined />
                        <Text style={{ fontSize: 12 }}>{dayjs(activityModal.player.createdAt).format('DD/MM/YYYY')}</Text>
                      </Space>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={8}>
                  <Row gutter={8}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f0f8ff', borderRadius: '4px', marginBottom: '6px' }}>
                        <TrophyOutlined style={{ fontSize: 14, color: '#1890ff' }} />
                        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#1890ff' }}>0</div>
                        <Text type="secondary" style={{ fontSize: 10 }}>Giải đấu</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f6ffed', borderRadius: '4px', marginBottom: '6px' }}>
                        <FireOutlined style={{ fontSize: 14, color: '#52c41a' }} />
                        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#52c41a' }}>0</div>
                        <Text type="secondary" style={{ fontSize: 10 }}>Luyện tập</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#fff7e6', borderRadius: '4px', marginBottom: '6px' }}>
                        <TeamOutlined style={{ fontSize: 14, color: '#faad14' }} />
                        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#faad14' }}>0</div>
                        <Text type="secondary" style={{ fontSize: 10 }}>Họp team</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '6px', backgroundColor: '#f9f0ff', borderRadius: '4px', marginBottom: '6px' }}>
                        <UserOutlined style={{ fontSize: 14, color: '#722ed1' }} />
                        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#722ed1' }}>0</div>
                        <Text type="secondary" style={{ fontSize: 10 }}>Tổng điểm</Text>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>

            {/* Bảng hoạt động */}
            <Card title="Hoạt động gần đây" style={{ borderRadius: 8 }}>
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                <TrophyOutlined style={{ fontSize: 32, marginBottom: 12 }} />
                <div style={{ fontSize: 14, marginBottom: 6 }}>Chưa có hoạt động nào</div>
                <Text type="secondary" style={{ fontSize: 12 }}>Hoạt động sẽ được hiển thị khi player tham gia các sự kiện</Text>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPlayersPage; 