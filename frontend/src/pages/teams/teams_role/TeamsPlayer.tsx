import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Typography, Button, List, Tag, Modal,
  notification, Popconfirm, Divider, Empty, Spin, Space, Avatar, Badge
} from 'antd';
import {
  UserOutlined, TeamOutlined, LogoutOutlined, HistoryOutlined, 
  UserAddOutlined, CheckOutlined, CloseOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { teamsApi } from '../../../api/teams.api';
import { getTeamInvites, acceptTeamInvite, rejectTeamInvite } from '../../../api/team-invites.api';
import { leaveTeam } from '../../../api/teams.api';
import { getProfile } from '../../../api/users.api';

const { Title, Text } = Typography;

const TeamsPlayer: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const playerId = user?.id;
  const role = user?.role?.name;

  if (role !== 'player') {
    return <Empty description="Bạn không có quyền truy cập trang này." style={{ marginTop: 100 }} />;
  }

  const [playerTeams, setPlayerTeams] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invites, setInvites] = useState<any[]>([]);
  const [leaveModal, setLeaveModal] = useState(false);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      
      // Lấy thông tin team của player
      const response = await teamsApi.getPlayerTeams();
      setPlayerTeams(response.data); // Lấy đúng data
      console.log('teamsData:', response.data);
      
      // Lấy team invites
      const invitesData = await getTeamInvites();
      setInvites(invitesData || []);
      
      setLoading(false);
    } catch (e) {
      console.error('Error fetching player data:', e);
      notification.error({ message: 'Lỗi tải dữ liệu' });
      setLoading(false);
    }
  };

  useEffect(() => {
    // Luôn fetch lại profile khi vào trang này để đồng bộ trạng thái team
    const syncUserProfile = async () => {
      try {
        const res = await getProfile();
        const user = res.user;
        user.teamId = user.player?.team?.id ?? null;
        user.teamName = user.player?.team?.name ?? null;
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        // Có thể log lỗi hoặc bỏ qua nếu chưa đăng nhập
      }
    };
    syncUserProfile();
    fetchPlayerData();
  }, [playerId]);

  // Rời team
  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(playerTeams.currentTeam.id);
      notification.success({ message: 'Đã rời team thành công' });
      setLeaveModal(false);
      await fetchPlayerData();
      // Luôn fetch lại profile và cập nhật localStorage sau khi rời team
      const res = await getProfile();
      const user = res.user;
      user.teamId = user.player?.team?.id ?? null;
      user.teamName = user.player?.team?.name ?? null;
      localStorage.setItem('user', JSON.stringify(user));
      window.location.reload(); // Đảm bảo reload lại dữ liệu mới nhất
    } catch {
      notification.error({ message: 'Rời team thất bại' });
    }
  };

  // Xử lý lời mời team
  const handleInviteResponse = async (inviteId: number, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await acceptTeamInvite(inviteId.toString());
        notification.success({ message: 'Đã gia nhập team' });

        // Sau khi invite thành công, fetch lại user
          const res = await getProfile();
          const user = res.user;

          // Thêm teamId, teamName vào user (nếu có)
          user.teamId = user.player?.team?.id ?? null;
          user.teamName = user.player?.team?.name ?? null;

          localStorage.setItem('user', JSON.stringify(user));
          window.location.reload(); // reload để Dashboard lấy user mới
      } else {
        await rejectTeamInvite(inviteId.toString());
        notification.success({ message: 'Đã từ chối lời mời' });
      }
      await fetchPlayerData(); // Đảm bảo gọi lại API lấy team mới
    } catch {
      notification.error({ message: 'Xử lý lời mời thất bại' });
    }
  };

  // Render thông tin team hiện tại
  const renderCurrentTeam = () => {
    if (!playerTeams?.currentTeam) return null;
    
    const team = playerTeams.currentTeam;
    
    return (
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Team hiện tại</span>
            <Tag color="green">Đang tham gia</Tag>
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
        <Text strong>Số thành viên:</Text> <Text>{team.memberCount}</Text>
      </Card>
    );
  };

  // Render danh sách thành viên team hiện tại
  const renderCurrentTeamMembers = () => {
    if (!playerTeams?.currentTeam) return null;
    
    const team = playerTeams.currentTeam;
    
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
                      <b>{member.fullName || member.email}</b>
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
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>Trạng thái tuyển thủ</span>
            <Tag color="orange">Free Agent</Tag>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Empty 
          description={
            <div>
              <Title level={4}>Bạn không có team</Title>
              <Text>Hãy chờ lời mời từ các team hoặc tìm team phù hợp</Text>
            </div>
          }
          style={{ padding: '40px 0' }}
        />
      </Card>
    );
  };

  // Render lời mời team
  const renderTeamInvites = () => {
    return (
      <Card title="Lời mời team">
        {invites.length > 0 ? (
          <List
            dataSource={invites}
            renderItem={invite => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleInviteResponse(invite.id, 'accept')}
                  >
                    Đồng ý
                  </Button>,
                  <Button
                    danger
                    size="small"
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
                      <span>Trạng thái: {invite.status}</span>
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

  // Render teams đã từng tham gia (cho free agent)
  const renderPreviousTeams = () => {
    if (playerTeams?.currentTeam) return null; // Chỉ hiển thị khi không có team hiện tại
    
    return (
      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            <span>Teams đã từng tham gia</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Empty description="Chưa có lịch sử tham gia team nào." />
      </Card>
    );
  };

  if (loading) return <Spin style={{ marginTop: 100 }} />;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Xin chào, <span style={{ color: '#1677ff' }}>{user.fullname}</span>
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          {playerTeams?.currentTeam ? (
            <>
              {renderCurrentTeam()}
              {renderCurrentTeamMembers()}
            </>
          ) : (
            <>
              {renderFreeAgentView()}
              {renderPreviousTeams()}
            </>
          )}
        </Col>
        
        <Col xs={24} md={8}>
          {renderTeamInvites()}
          
          {/* Thống kê nhanh */}
          <Card
            title="Thống kê cá nhân"
            style={{ marginBottom: 24 }}
          >
            <Text strong>Team hiện tại:</Text> {playerTeams?.currentTeam ? playerTeams.currentTeam.name : 'Không có'}<br />
            <Text strong>Trạng thái:</Text> {playerTeams?.currentTeam ? 'Đang tham gia' : 'Free Agent'}<br />
            <Text strong>Lời mời đang chờ:</Text> {playerTeams?.pendingInvites?.length || 0}<br />
            <Text strong>Tổng số team:</Text> {playerTeams?.otherTeams?.length || 0}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeamsPlayer; 