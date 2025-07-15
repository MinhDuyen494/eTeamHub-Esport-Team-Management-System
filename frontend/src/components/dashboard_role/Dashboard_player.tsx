import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Card, Statistic, Timeline, Progress, Tag, Empty, Space, Spin, message } from "antd";
import { TeamOutlined, CalendarOutlined, CheckCircleTwoTone, ClockCircleTwoTone } from '@ant-design/icons';
import { getProfile } from "../../api/users.api";
import { getMyPlayerReport } from "../../api/reports.api";
import { getRecentActivityLogs } from "../../api/activity-log.api";

const { Title } = Typography;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi trưa";
  return "Chào buổi chiều";
}

const DashboardPlayer: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [playerReport, setPlayerReport] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userProfileResponse = await getProfile();
        const userData = userProfileResponse.user || userProfileResponse;
        setUser(userData);
        const report = await getMyPlayerReport();
        setPlayerReport(report);
        // Lấy log hoạt động, filter ở FE nếu cần
        const logs = await getRecentActivityLogs(10);
        setActivityLogs(
          logs.filter(
            (log: any) =>
              log.userId === userData.id || log.relatedUserIds?.includes(userData.id)
          )
        );
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu dashboard!");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !user || !playerReport) return <Spin />;

  // Lấy teamName
  const teamName = user.player?.team?.name || user.teamName || "--";
  // Số event đã tham gia
  const attendedCount = playerReport.eventDetails?.filter((e: any) => ["present", "absent"].includes(e.checkInStatus)).length || 0;
  // Số event sắp diễn ra
  const now = new Date();
  const upcomingCount = playerReport.eventDetails?.filter((e: any) => new Date(e.eventDate) > now).length || 0;
  // Điểm danh event gần nhất
  const sortedEvents = [...(playerReport.eventDetails || [])].sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  const latestEvent = sortedEvents[0];
  // Tổng số thành viên team (nếu có)
  const totalMembers = user.player?.team?.totalMembers || playerReport.totalMembers || 0;
  // Số thành viên đã điểm danh (nếu có)
  const attended = latestEvent ? (latestEvent.attended || 0) : 0;

  // Block: Team
  const TeamBlock = () => (
    <Statistic
      title="Tên đội"
      value={teamName}
      prefix={<TeamOutlined />}
      valueStyle={{ color: '#1890ff' }}
    />
  );
  // Block: Số event đã tham gia
  const AttendedEventsBlock = () => (
    <Statistic
      title="Số sự kiện đã tham gia"
      value={attendedCount}
      prefix={<CalendarOutlined />}
      valueStyle={{ color: '#52c41a' }}
    />
  );
  // Block: Số event sắp diễn ra
  const UpcomingEventsBlock = () => (
    <Statistic
      title="Sự kiện sắp diễn ra"
      value={upcomingCount}
      prefix={<CalendarOutlined />}
      valueStyle={{ color: '#faad14' }}
    />
  );
  // Block: Hoạt động gần đây
  const RecentActivityBlock = () => (
    activityLogs.length > 0 ? (
      <Timeline
        items={activityLogs.map((log, idx) => ({
          children: (
            <span>
              <b>{log.action}</b> - {log.description}
              <span style={{ color: '#aaa', marginLeft: 12 }}>
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </span>
          ),
        }))}
      />
    ) : (
      <Empty description="Chưa có hoạt động nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  );
  // Block: Điểm danh gần đây
  const RecentAttendanceBlock = () => {
    if (!latestEvent) return <Empty description="Chưa có sự kiện điểm danh" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    // Số thành viên đã điểm danh (nếu có)
    const attended = latestEvent.attended || 0;
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <b>{latestEvent.eventTitle}</b>
        <span style={{ color: '#888' }}>
          <ClockCircleTwoTone twoToneColor="#faad14" style={{ marginRight: 6 }} />
          {new Date(latestEvent.eventDate).toLocaleString()}
        </span>
        <Progress
          percent={totalMembers ? Math.round((attended / totalMembers) * 100) : 0}
          status={attended === totalMembers ? 'success' : 'active'}
          size="small"
          format={() => `${attended}/${totalMembers}`}
        />
        <Tag color={attended === totalMembers ? 'green' : 'orange'}>
          {attended === totalMembers ? (
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
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={2} style={{ marginBottom: 32 }}>
        {getGreeting()}, {user.fullname || user.email || "Player"}!
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}><Card><TeamBlock /></Card></Col>
        <Col xs={24} sm={8}><Card><AttendedEventsBlock /></Card></Col>
        <Col xs={24} sm={8}><Card><UpcomingEventsBlock /></Card></Col>
      </Row>
      <Row style={{ marginTop: 32 }} gutter={[24, 24]}>
        <Col xs={24} md={16}><Card title="Hoạt động gần đây"><RecentActivityBlock /></Card></Col>
        <Col xs={24} md={8}><Card title="Điểm danh gần đây"><RecentAttendanceBlock /></Card></Col>
      </Row>
    </div>
  );
};

export default DashboardPlayer;
