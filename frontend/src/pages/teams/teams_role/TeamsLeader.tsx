import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, Typography, Button, List, Tag, Modal,
  Input, Form, notification, Popconfirm, Divider, Empty, Spin, Space, Avatar
} from 'antd';
import {
  UserAddOutlined, DeleteOutlined, ReloadOutlined, UserOutlined, EditOutlined
} from '@ant-design/icons';
import { getTeams, updateTeam, addMember, removeMember, getTeamInvites, getEvents, getTeamAttendances, getRecentActivityLogs } from '../../../api/teams.api';
import { getPlayers } from '../../../api/players.api';
import { createTeamInvite } from '../../../api/team-invites.api';
import axiosClient from '../../../api/axiosClient';

const { Title, Text } = Typography;

const TeamsLeader: React.FC = () => {
  // Lấy user đăng nhập từ localStorage (hoặc AuthContext nếu bạn dùng context)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const leaderId = user?.id;
  // Kiểm tra role
  const role = user?.role?.name;

  if (role !== 'leader') {
    return <Empty description="Bạn không có quyền truy cập trang này." style={{ marginTop: 100 }} />;
  }

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Thêm state cho các dữ liệu mới
  const [invites, setInvites] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [latestAttendance, setLatestAttendance] = useState<any>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);

  const fetchTeam = async () => {
    if (!leaderId) {
      notification.error({ message: 'Không tìm thấy leaderId.' });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const teams = await getTeams();
      // Tìm team leader đang quản lý
      const myTeam = teams.find((t: any) => t.leader?.id === leaderId);
      setTeam(myTeam);
      setLoading(false);
    } catch (e) {
      notification.error({ message: 'Lỗi tải dữ liệu team' });
      setLoading(false);
    }
  };

  // Hàm fetch dữ liệu bổ sung
  const fetchExtraData = async (teamId: string) => {
    try {
      // Gọi API lấy invites của team (cho leader)
      let invitesRes = [];
      if (user.role.name === 'leader') {
        const res = await getTeamInvites();
        invitesRes = res.data;
      }
      const [eventsRes, attendanceRes, logRes] = await Promise.all([
        getEvents(),
        getTeamAttendances(teamId),
        getRecentActivityLogs(),
      ]);
      setInvites(invitesRes || []);
      setUpcomingEvents((eventsRes || []).filter((e: any) => new Date(e.startTime) > new Date()));
      setLatestAttendance((attendanceRes || [])[0] || null);
      setActivityLog(logRes || []);
    } catch (e) {
      notification.error({ message: 'Lỗi tải dữ liệu bổ sung' });
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line
  }, [leaderId]);

  useEffect(() => {
    if (team?.id) {
      fetchExtraData(team.id);
    }
  }, [team]);

  // Kick member
  const handleKick = async (memberId: string) => {
    try {
      await removeMember(team.id, { playerId: memberId }); // <-- sửa key thành playerId
      notification.success({ message: 'Đã kick thành viên' });
      fetchTeam();
    } catch {
      notification.error({ message: 'Kick thất bại' });
    }
  };

  // Mời member
  const handleInvite = async (values: { email: string }) => {
    try {
      const players = await getPlayers();
      // Tìm player theo email user
      const found = players.find((p: any) => p.user?.email === values.email);
      if (!found) {
        notification.error({ message: 'Không tìm thấy tuyển thủ với email này' });
        return;
      }
      await createTeamInvite({ teamId: team.id, playerId: Number(found.id), status: 'pending' });
      setInviteModal(false);
      inviteForm.resetFields();
      notification.success({ message: 'Đã gửi lời mời' });
      fetchTeam();
      
    } catch (err: any) {
      notification.error({ message: err.response?.data?.message || 'Gửi lời mời thất bại' });
    }
  };

  // Sửa mô tả team
  const handleEdit = async (values: any) => {
    try {
      await updateTeam(team.id, { description: values.description });
      notification.success({ message: 'Đã cập nhật mô tả' });
      setEditModal(false);
      fetchTeam();
    } catch {
      notification.error({ message: 'Cập nhật thất bại' });
    }
  };

  // Block mô tả team
  const renderTeamInfo = () => {
    if (!team) return null;
    return (
      <Card
        bordered={false}
        style={{ minHeight: 230, boxShadow: '0 2px 8px #f0f1f2', borderRadius: 10 }}
        title={
          <Space>
            <UserOutlined /> Thông tin team
          </Space>
        }
        extra={
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditModal(true);
              editForm.setFieldsValue({ description: team.description });
            }}
          >
            Sửa mô tả
          </Button>
        }
      >
        <Title level={4} style={{ marginBottom: 8 }}>{team.name}</Title>
        <Text strong>Mô tả:</Text> <Text>{team.description || '(Chưa có mô tả)'}</Text><br />
        <Text strong>Trạng thái:</Text>{' '}
        <Tag color={team.status === 'active' ? 'green' : 'red'}>
          {team.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
        </Tag>
        <br />
        <Text strong>Ngày tạo:</Text> {new Date(team.createdAt).toLocaleDateString()}<br />
        <Text strong>Số thành viên:</Text> {team.members?.length || 0}
      </Card>
    );
  };

  // Block thành viên team
  const renderMembers = () => {
    if (!team) return <Empty description="Bạn chưa quản lý team nào." />;
    return (
      <Card
        title={<Space><UserOutlined /> Danh sách thành viên</Space>}
        extra={
          <Button type="primary" icon={<UserAddOutlined />} onClick={() => setInviteModal(true)}>
            Mời thành viên
          </Button>
        }
        style={{ minHeight: 320, boxShadow: '0 2px 8px #f0f1f2', borderRadius: 10 }}
      >
        {team.members && team.members.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={team.members}
            renderItem={(member: any) => (
              <List.Item
                actions={[
                  member.role?.name !== 'leader' && (
                    <Popconfirm
                      title="Xác nhận kick thành viên này?"
                      onConfirm={() => handleKick(member.id)}
                      okText="Kick"
                      cancelText="Hủy"
                    >
                      <Button danger size="small" icon={<DeleteOutlined />}>Kick</Button>
                    </Popconfirm>
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={<b>{member.fullname || member.email} {member.ign ? `(${member.ign})` : ''}</b>}
                  description={
                    <>
                      <Tag color={member.role?.name === 'leader' ? 'geekblue' : 'green'}>
                        {member.role?.name === 'leader' ? 'Leader' : member.role?.name || 'Player'}
                      </Tag>
                      <Text type="secondary" style={{ marginLeft: 10 }}>
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

  // Block thống kê nhanh (sự kiện, điểm danh)
  const renderStats = () => (
    <Card
      title={<Space><ReloadOutlined /> Thống kê nhanh</Space>}
      style={{ minHeight: 230, boxShadow: '0 2px 8px #f0f1f2', borderRadius: 10 }}
      extra={<Button icon={<ReloadOutlined />} onClick={fetchTeam} />}
    >
      <Text strong>Sự kiện sắp diễn ra:</Text><br />
      {upcomingEvents.length > 0 ? (
        <List
          size="small"
          dataSource={upcomingEvents.slice(0, 2)}
          renderItem={event => (
            <List.Item>
              <b>{event.name}</b> - {new Date(event.startTime).toLocaleString()}
            </List.Item>
          )}
        />
      ) : <Text type="secondary">Không có sự kiện nào.</Text>}
      <Divider />
      <Text strong>Điểm danh gần nhất:</Text><br />
      {latestAttendance ? (
        <div>
          <b>{new Date(latestAttendance.createdAt).toLocaleString()}</b><br />
          <Text type="secondary">Người điểm danh: {latestAttendance.user?.fullname || latestAttendance.user?.email}</Text>
        </div>
      ) : <Text type="secondary">Chưa có dữ liệu.</Text>}
    </Card>
  );

  // Block lời mời
  const renderInvites = () => {
    console.log('invites:', invites);
    console.log('team:', team);
    const teamInvites = invites.filter(invite => invite.team?.id === team.id);
    return (
      <Card
        title="Lời mời đang chờ"
        style={{ minHeight: 120, boxShadow: '0 2px 8px #f0f1f2', borderRadius: 10 }}
        extra={
          <Button size="small" onClick={fetchTeam}>
            Làm mới
          </Button>
        }
      >
        {teamInvites.length > 0 ? (
          <List
            size="small"
            dataSource={teamInvites}
            renderItem={invite => (
              <List.Item>
                <b>{invite.email || invite.username}</b> - <Tag color="orange">{invite.status}</Tag>
              </List.Item>
            )}
          />
        ) : <Text type="secondary">Không có lời mời nào.</Text>}
      </Card>
    );
  };

  // Block nhật ký hoạt động
  const renderActivityLog = () => {
    console.log('activityLog:', activityLog);
    console.log('team:', team);
    const teamLogs = activityLog.filter(log => log.teamId === team.id);
    return (
      <Card
        title="Nhật ký hoạt động team"
        style={{ minHeight: 120, boxShadow: '0 2px 8px #f0f1f2', borderRadius: 10 }}
      >
        {teamLogs.length > 0 ? (
          <List
            size="small"
            dataSource={teamLogs.slice(0, 5)}
            renderItem={log => (
              <List.Item>
                <Text>{log.action}</Text> - <Text type="secondary">{new Date(log.createdAt).toLocaleString()}</Text>
              </List.Item>
            )}
          />
        ) : <Text type="secondary">Chưa có hoạt động nào.</Text>}
      </Card>
    );
  };

  if (loading) return <Spin style={{ marginTop: 100 }} />;
  if (!team && user.role.name !== 'admin') {
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
        <Empty description="Bạn chưa quản lý team nào." style={{ marginTop: 100 }} />
        <Button
          type="primary"
          style={{ marginTop: 24 }}
          onClick={() => setEditModal(true)}
        >
          Tạo team mới
        </Button>
        {/* Modal tạo team mới */}
        <Modal
          title="Tạo team mới"
          open={editModal}
          onCancel={() => setEditModal(false)}
          onOk={() => editForm.submit()}
          okText="Tạo"
        >
          <Form form={editForm} layout="vertical" onFinish={handleEdit}>
            <Form.Item name="name" label="Tên team" rules={[{ required: true, message: 'Nhập tên team' }]}> <Input /> </Form.Item>
            <Form.Item name="description" label="Mô tả"> <Input.TextArea rows={3} /> </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={3} style={{ marginBottom: 24 }}>
        Xin chào leader, <span style={{ color: '#1677ff' }}>{user.fullname || user.email}</span>
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>{renderTeamInfo()}</Col>
        <Col xs={24} md={8}>{renderStats()}</Col>
      </Row>

      <Divider style={{ margin: '24px 0' }} />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>{renderMembers()}</Col>
        <Col xs={24} md={8}>{renderInvites()}</Col>
      </Row>

      <Divider style={{ margin: '24px 0' }} />

      {renderActivityLog()}

      {/* Modal mời thành viên */}
      <Modal
        title="Mời thành viên mới"
        open={inviteModal}
        onCancel={() => setInviteModal(false)}
        onOk={() => inviteForm.submit()}
        okText="Mời"
        cancelText="Hủy"
      >
        <Form form={inviteForm} layout="vertical" onFinish={handleInvite}>
          <Form.Item name="email" label="Email hoặc Username" rules={[{ required: true, message: 'Nhập email hoặc username' }]}>
            <Input placeholder="Nhập email hoặc username" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa mô tả */}
      <Modal
        title="Chỉnh sửa mô tả team"
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={() => editForm.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Nhập mô tả' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamsLeader;
