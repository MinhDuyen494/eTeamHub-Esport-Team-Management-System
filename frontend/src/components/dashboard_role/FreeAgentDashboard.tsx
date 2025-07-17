import React, { useEffect, useState } from "react";
import { Typography, Card, Timeline, Empty, Spin } from "antd";
import { getProfile } from "../../api/users.api";
import { getRecentActivityLogs } from "../../api/activity-log.api";
import { getMyPlayerReport } from "../../api/reports.api";

const { Title } = Typography;

export default function FreeAgentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [playerReport, setPlayerReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const userProfile = await getProfile();
      setUser(userProfile.user || userProfile);
      const logs = await getRecentActivityLogs(10);
      setActivityLogs(logs);
      const report = await getMyPlayerReport();
      setPlayerReport(report);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <Spin />;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Title level={3}>Bạn hiện chưa thuộc team nào</Title>
      <Card title="Hoạt động gần đây" style={{ marginBottom: 24 }}>
        {activityLogs.length > 0 ? (
          <Timeline
            items={activityLogs.map((log: any) => ({
              children: (
                <span>
                  <b>{log.action}</b> - {log.description}
                  <span style={{ color: "#aaa", marginLeft: 12 }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </span>
              ),
            }))}
          />
        ) : (
          <Empty description="Chưa có hoạt động nào" />
        )}
      </Card>
      <Card title="Các sự kiện đã tham gia">
        {playerReport?.eventDetails?.length > 0 ? (
          <Timeline
            items={playerReport.eventDetails.map((event: any) => ({
              children: (
                <span>
                  <b>{event.eventTitle}</b> - {event.checkInStatus}
                  <span style={{ color: "#aaa", marginLeft: 12 }}>
                    {new Date(event.eventDate).toLocaleString()}
                  </span>
                </span>
              ),
            }))}
          />
        ) : (
          <Empty description="Chưa có sự kiện nào" />
        )}
      </Card>
    </div>
  );
} 