import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Typography, Button, List, Tag, Modal,
  notification, Popconfirm, Divider, Empty, Spin, Space, Avatar, Badge
} from 'antd';
import {
  UserOutlined, TeamOutlined, LogoutOutlined, HistoryOutlined, 
  UserAddOutlined, CheckOutlined, CloseOutlined
} from '@ant-design/icons';
import { getTeams, leaveTeam, getTeamInvites, getRecentActivityLogs } from '../../../api/teams.api';

const { Title, Text } = Typography;

const TeamsPlayer: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const playerId = user?.id;
  const role = user?.role?.name;

  if (role !== 'player') {
    return <Empty description="Bạn không có quyền truy cập trang này." style={{ marginTop: 100 }} />;
  }

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [leaveModal, setLeaveModal] = useState(false);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const teams = await getTeams();
      // Tìm team mà player đang tham gia
      const myTeam = teams.find((t: any) => 
        t.members?.some((member: any) => member.id === playerId)
      );
      setTeam(myTeam);
      
      // Fetch invites và activity log
      const [invitesRes, logRes] = await Promise.all([
        getTeamInvites(),
        getRecentActivityLogs(),
      ]);
      setInvites(invitesRes || []);
      setActivityLog(logRes || []);
      setLoading(false);
    } catch (e) {
      notification.error({ message: 'Lỗi tải dữ liệu' });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerData();
  }, [playerId]);

  // Rời team
  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(team.id);
      notification.success({ message: 'Đã rời team thành công' });
      setLeaveModal(false);
      fetchPlayerData(); // Refresh data
    } catch {
      notification.error({ message: 'Rời team thất bại' });
    }
  };

  // Xử lý lời mời team
  const handleInviteResponse = async (inviteId: string, action: 'accept' | 'reject') => {
    try {
      // TODO: Implement API call to accept/reject invite
      if (action === 'accept') {
        notification.success({ message: 'Đã gia nhập team' });
      } else {
        notification.success({ message: 'Đã từ chối lời mời' });
      }
      fetchPlayerData();
    } catch {
      notification.error({ message: 'Xử lý lời mời thất bại' });
    }
  };

  // Render thông tin team (khi có team)
  const renderTeamInfo = () => {
    if (!team) return null;
    
    return (
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Thông tin team</span>
          </Space>
        }
        extra={
          <Popconfirm
            title="Xác nhận rời team?"
            description="Bạn sẽ trở thành tuyển thủ tự do sau khi rời team."
            onConfirm={handleLeaveTeam}
            okText="Rời team"
            cancelText="Hủy"
          >
            <Button danger icon={<LogoutOutlined />}>
              Rời team
            </Button>
          </Popconfirm>
        }
        style={{ marginBottom: 24 }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>{team.name}</Title>
        <Text strong>Mô tả:</Text> <Text>{team.description || '(Chưa có mô tả)'}</Text><br />
        <Text strong>Leader:</Text> <Text>{team.leader?.email}</Text><br />
        <Text strong>Ngày tham gia:</Text> <Text>{new Date(team.createdAt).toLocaleDateString()}</Text><br />
        <Text strong>Số thành viên:</Text> <Text>{team.members?.length || 0}</Text>
      </Card>
    );
  };

  // Render danh sách thành viên
  const renderTeamMembers = () => {
    if (!team) return null;
    
    return (
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>Thành viên team</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {team.members && team.members.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={team.members}
            renderItem={(member: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge dot={member.id === playerId} offset={[-5, 5]}>
                      <Avatar icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={
                    <Space>
                      <b>{member.fullname || member.email}</b>
                      {member.id === playerId && <Tag color="blue">Bạn</Tag>}
                      {member.role?.name === 'leader' && <Tag color="geekblue">Leader</Tag>}
                    </Space>
                  }
                  description={
                    <>
                      {member.ign && <Text type="secondary">IGN: {member.ign}</Text>}
                      <br />
                      <Text type="secondary">
                        {member.online ? <Tag color="green">Online</Tag> : <Tag color="red">Offline</Tag>}
                      </Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Chưa có thành viên nào." />
        )}
      </Card>
    );
  };

  // Render giao diện khi không có team (Free Agent)
  const renderFreeAgentView = () => {
    return (
      <>
        <Card
          title={
            <Space>
              <UserOutlined />
              <span>Trạng thái tuyển thủ</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Empty 
            description={
              <div>
                <Title level={4}>Bạn không có team</Title>
                <Text>Hãy gia nhập một team để bắt đầu</Text>
              </div>
            }
            style={{ padding: '40px 0' }}
          />
        </Card>

        {/* Lịch sử hoạt động */}
        <Card
          title={
            <Space>
              <HistoryOutlined />
              <span>Lịch sử hoạt động</span>
            </Space>
          }
        >
          {activityLog.length > 0 ? (
            <List
              size="small"
              dataSource={activityLog.slice(0, 10)}
              renderItem={log => (
                <List.Item>
                  <Text>{log.action}</Text> - <Text type="secondary">{new Date(log.createdAt).toLocaleString()}</Text>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">Chưa có hoạt động nào.</Text>
          )}
        </Card>
      </>
    );
  };

  // Render lời mời team
  const renderTeamInvites = () => {
    return (
      <Card
        title={
          <Space>
            <UserAddOutlined />
            <span>Lời mời team</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {invites.length > 0 ? (
          <List
            size="small"
            dataSource={invites}
            renderItem={invite => (
              <List.Item
                actions={[
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<CheckOutlined />}
                    onClick={() => handleInviteResponse(invite.id, 'accept')}
                  >
                    Gia nhập
                  </Button>,
                  <Button 
                    danger 
                    size="small" 
                    icon={<CloseOutlined />}
                    onClick={() => handleInviteResponse(invite.id, 'reject')}
                  >
                    Từ chối
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={<b>{invite.team?.name || 'Team không xác định'}</b>}
                  description={
                    <>
                      <Text type="secondary">Lời mời từ: {invite.sender?.email}</Text><br />
                      <Text type="secondary">Ngày: {new Date(invite.createdAt).toLocaleDateString()}</Text>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">Không có lời mời nào.</Text>
        )}
      </Card>
    );
  };

  if (loading) return <Spin style={{ marginTop: 100 }} />;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Xin chào, <span style={{ color: '#1677ff' }}>{user.fullname || user.email}</span>
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          {team ? (
            <>
              {renderTeamInfo()}
              {renderTeamMembers()}
            </>
          ) : (
            renderFreeAgentView()
          )}
        </Col>
        
        <Col xs={24} md={8}>
          {renderTeamInvites()}
          
          {/* Thống kê nhanh */}
          <Card
            title="Thống kê cá nhân"
            style={{ marginBottom: 24 }}
          >
            <Text strong>Team hiện tại:</Text> {team ? team.name : 'Không có'}<br />
            <Text strong>Vai trò:</Text> {team ? 'Thành viên' : 'Tuyển thủ tự do'}<br />
            <Text strong>Lời mời đang chờ:</Text> {invites.length}<br />
            <Text strong>Hoạt động gần đây:</Text> {activityLog.length}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeamsPlayer; 