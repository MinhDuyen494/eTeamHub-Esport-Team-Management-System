import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Timeline, Typography, Progress, List, Tag, Space, message, Empty, Button } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined, CheckCircleTwoTone, ClockCircleTwoTone } from '@ant-design/icons';
import { getUserStats } from '../api/users.api';
import { getTeamStats } from '../api/teams.api';
import { getUpcomingEventsCount } from '../api/events.api';
import { getRecentActivityLogs } from '../api/activity-log.api';
import { getRecentAttendanceEvents } from '../api/attendance.api';

const { Title, Text } = Typography;

// Debug component to show token and user info
const DebugInfo: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const token = localStorage.getItem('accessToken');
  const userData = localStorage.getItem('user');

  return (
    <Card style={{ marginBottom: 16 }}>
      <Button onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? 'Ẩn Debug Info' : 'Hiển thị Debug Info'}
      </Button>
      {showDebug && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Token:</Text>
          <div style={{ wordBreak: 'break-all', fontSize: '12px', marginBottom: 8 }}>
            {token ? token.substring(0, 50) + '...' : 'Không có token'}
          </div>
          <Text strong>User Data:</Text>
          <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: 8 }}>
            {userData || 'Không có user data'}
          </pre>
        </div>
      )}
    </Card>
  );
};

// Block "Điểm danh mới nhất"
const RecentAttendanceBlock: React.FC = () => {
  const [attendanceEvents, setAttendanceEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);   
    setError(null);
    getRecentAttendanceEvents(5)
      .then(setAttendanceEvents)
      .catch((err) => {
        console.error('Error fetching attendance events:', err);
        setError('Không lấy được dữ liệu điểm danh');
        message.error('Không lấy được dữ liệu điểm danh!');
      })
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <Card title="Điểm danh mới nhất">
        <Empty 
          description={error}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card title="Điểm danh mới nhất" loading={loading}>
      {attendanceEvents.length > 0 ? (
        <List
          dataSource={attendanceEvents}
          renderItem={event => (
            <List.Item key={event.id}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <b>{event.name}</b>
                <span style={{ color: '#888' }}>
                  <ClockCircleTwoTone twoToneColor="#faad14" style={{ marginRight: 6 }} />
                  {new Date(event.startTime).toLocaleString()}
                </span>
                <Progress
                  percent={Math.round((event.checkedIn / event.totalMember) * 100)}
                  status={event.checkedIn === event.totalMember ? 'success' : 'active'}
                  size="small"
                  format={percent => `${event.checkedIn}/${event.totalMember}`}
                />
                <Tag color={event.checkedIn === event.totalMember ? 'green' : 'orange'}>
                  {event.checkedIn === event.totalMember ? (
                    <>
                      <CheckCircleTwoTone twoToneColor="#52c41a" /> Đã điểm danh đủ
                    </>
                  ) : (
                    <>
                      <ClockCircleTwoTone twoToneColor="#faad14" /> Đang chờ điểm danh
                    </>
                  )}
                </Tag>
              </Space>
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description="Chưa có sự kiện nào vừa điểm danh"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  // State cho các số liệu tổng hợp
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<number>(0);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      getUserStats(),
      getTeamStats(),
      getUpcomingEventsCount(),
      getRecentActivityLogs(5),
    ])
      .then(([userStats, teamStats, eventStats, logs]) => {
        setTotalUsers(userStats.totalUsers);
        setTotalTeams(teamStats.totalTeams);
        setUpcomingEvents(eventStats.upcomingCount);
        setActivityLogs(logs);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        setError('Không lấy được dữ liệu dashboard');
        message.error('Không lấy được dữ liệu dashboard!');
      })
      .finally(() => setLoading(false));
  }, []);

  // Hàm format activity log message
  const formatActivityMessage = (log: any) => {
    const userName = log.user?.email?.split('@')[0] || 'Unknown';
    const userRole = log.user?.role || 'user';
    
    switch (log.action) {
      case 'create_team':
        return `${userRole} ${userName} tạo team "${log.detail?.name || 'Unknown'}"`;
      case 'add_member_to_team':
        return `${userRole} ${userName} thêm thành viên ${log.detail?.memberName || 'Unknown'} vào team`;
      case 'create_event':
        return `${userRole} ${userName} tạo event "${log.detail?.title || 'Unknown'}"`;
      case 'checkin_attendance':
        return `${userRole} ${userName} điểm danh thành viên`;
      case 'update_profile':
        return `${userRole} ${userName} cập nhật thông tin cá nhân`;
      default:
        return `${userRole} ${userName} thực hiện ${log.action}`;
    }
  };

  // Hàm format thời gian
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  if (error) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <Title level={2} style={{ marginBottom: 32 }}>
          Dashboard Admin
        </Title>
        <Empty 
          description={error}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={2} style={{ marginBottom: 32 }}>
        Chào buổi sáng, admin!
      </Title>
      <DebugInfo />
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số thành viên"
              value={totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Tổng số team"
              value={totalTeams}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Sự kiện sắp diễn ra"
              value={upcomingEvents}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 32 }} gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card title="Hoạt động gần nhất">
            {activityLogs.length > 0 ? (
              <Timeline
                items={activityLogs.map((log, idx) => ({
                  children: (
                    <span>
                      <b>{formatActivityMessage(log)}</b> 
                      <span style={{ color: '#aaa', marginLeft: 12 }}>
                        {formatTimeAgo(log.createdAt)}
                      </span>
                    </span>
                  ),
                }))}
              />
            ) : (
              <Empty 
                description="Chưa có hoạt động nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <RecentAttendanceBlock />
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
