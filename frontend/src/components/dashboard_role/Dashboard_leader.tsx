import React, { useEffect, useState } from "react";
import { Row, Col, Typography, message, Spin, Card, Statistic, Timeline, Progress, Tag, Empty, Space } from "antd";
import { TeamOutlined, UserOutlined, CalendarOutlined, CheckCircleTwoTone, ClockCircleTwoTone } from '@ant-design/icons';
import { getProfile } from "../../api/users.api";
import { getTeamReport } from "../../api/reports.api";
import { getRecentActivityLogs } from "../../api/activity-log.api";

const { Title } = Typography;

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi trưa";
  return "Chào buổi chiều";
}

// Kiểu dữ liệu cho user
interface User {
  id: number;   
  fullname: string;
  email: string;
  role: {
    name: string;
  };
  teamId: number;
}

// Kiểu dữ liệu cho teamInfo
interface TeamInfo {
  teamId: number;
  teamName: string;
  totalMembers: number;
  totalEvents: number;
}

// Kiểu dữ liệu cho eventTimeline
interface EventTimelineItem {
  eventId: number;
  title: string;
  date: string;
  type: string;
}

// Kiểu dữ liệu cho playerReports
interface PlayerReport {
  playerId: number;
  playerName: string;
  playerIGN: string;
  playerRole: string;
  totalEvents: number;
  presentCount: number;
  absentCount: number;
  acceptedCount: number;
  declinedCount: number;
  pendingCount: number;
  attendanceRate: string;
  eventDetails: Array<{
    eventId: number;
    eventTitle: string;
    eventDate: string;
    eventType: string;
    rsvpStatus: string;
    checkInStatus: string;
    note: string | null;
  }>;
}

// Kiểu dữ liệu cho activity log
interface ActivityLog {
  teamId: number;
  userId: number;
  relatedUserIds?: number[];
  action: string;
  description: string;
  createdAt: string;
}

const DashboardLeader: React.FC = () => {
  // Lấy user từ localStorage nếu có, để tránh null khi mới render
  const [user, setUser] = useState<User | null>(() => {
    const local = localStorage.getItem('user');
    if (local) return JSON.parse(local);
    return null;
  });
  const [teamReport, setTeamReport] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const userProfileResponse = await getProfile();
        const userData: User = userProfileResponse.user || userProfileResponse;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (!userData.role || userData.role.name !== "leader" || !userData.teamId) {
          message.error("Bạn không có quyền truy cập hoặc chưa thuộc team nào!");
          setLoading(false);
          return;
        }
        const report = await getTeamReport(userData.teamId.toString());
        setTeamReport(report);
        // Lấy log hoạt động, filter ở FE nếu cần
        const logs: ActivityLog[] = await getRecentActivityLogs(10);
        setActivityLogs(
          logs.filter(
            (log: ActivityLog) =>
              log.teamId === userData.teamId &&
              (log.userId === userData.id || log.relatedUserIds?.includes(userData.id))
          )
        );
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu dashboard!");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading || !user) return <Spin />;

  if (!user || !user.role || user.role.name !== "leader" || !user.teamId)
    return <div>Bạn không có quyền truy cập.</div>;

  // Block: Team Info
  const TeamInfoBlock: React.FC<{ teamInfo?: TeamInfo }> = ({ teamInfo }) => (
    <Statistic
      title="Tên đội"
      value={teamInfo?.teamName || "--"}
      prefix={<TeamOutlined />}
      valueStyle={{ color: '#1890ff' }}
    />
  );
  // Block: Member Count
  const MemberCountBlock: React.FC<{ totalMembers?: number }> = ({ totalMembers }) => (
    <Statistic
      title="Tổng thành viên"
      value={totalMembers ?? "--"}
      prefix={<UserOutlined />}
      valueStyle={{ color: '#52c41a' }}
    />
  );
  // Block: Upcoming Events
  const UpcomingEventsBlock: React.FC<{ totalEvents?: number }> = ({ totalEvents }) => (
    <Statistic
      title="Sự kiện sắp diễn ra"
      value={totalEvents ?? "--"}
      prefix={<CalendarOutlined />}
      valueStyle={{ color: '#faad14' }}
    />
  );
  // Block: Recent Activity
  const RecentActivityBlock: React.FC<{ logs: ActivityLog[] }> = ({ logs }) => (
    <>
      {logs?.length > 0 ? (
        <Timeline
          items={logs.map((log, idx) => ({
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
      )}
    </>
  );
  // Block: Recent Attendance
  const RecentAttendanceBlock: React.FC<{
    eventTimeline?: EventTimelineItem[];
    playerReports?: PlayerReport[];
    totalMembers?: number;
  }> = ({ eventTimeline, playerReports, totalMembers }) => {
    if (!eventTimeline || !playerReports) return <Empty description="Chưa có sự kiện điểm danh" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    // Lấy event gần nhất
    const latestEvent = eventTimeline[eventTimeline.length - 1];
    if (!latestEvent) return <Empty description="Chưa có sự kiện điểm danh" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    // Đếm số thành viên đã điểm danh
    const attended = playerReports.filter((p) =>
      p.eventDetails.some(
        (e) => e.eventId === latestEvent.eventId && e.checkInStatus === "present"
      )
    ).length;
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <b>{latestEvent.title}</b>
        <span style={{ color: '#888' }}>
          <ClockCircleTwoTone twoToneColor="#faad14" style={{ marginRight: 6 }} />
          {new Date(latestEvent.date).toLocaleString()}
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
        {getGreeting()}, leader {user.fullname || user.email || "Leader"}!
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card>
            <TeamInfoBlock teamInfo={teamReport?.teamInfo} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <MemberCountBlock totalMembers={teamReport?.teamInfo?.totalMembers} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <UpcomingEventsBlock totalEvents={teamReport?.teamInfo?.totalEvents} />
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 32 }} gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card title="Hoạt động gần đây">
            <RecentActivityBlock logs={activityLogs} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Điểm danh gần đây">
            <RecentAttendanceBlock
              eventTimeline={teamReport?.eventTimeline}
              playerReports={teamReport?.playerReports}
              totalMembers={teamReport?.teamInfo?.totalMembers}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardLeader;
