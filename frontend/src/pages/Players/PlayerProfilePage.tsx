import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Timeline, Empty, Row, Col, Descriptions, Divider, Spin } from 'antd';
import { getMyPlayer } from '../../api/players.api';
import { getRecentActivityLogs } from '../../api/activity-log.api';
import { getEvents } from '../../api/events.api';

const { Title } = Typography;

const PlayerProfilePage: React.FC = () => {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayerData = async () => {
             try {
         // Lấy thông tin player của user hiện tại
         const playerResponse = await getMyPlayer();
         if (playerResponse.player) {
           setPlayer(playerResponse.player);
         } else {
           // User chưa có player profile
           setPlayer(null);
         }

        // Lấy sự kiện đã tham gia (nếu có team)
        if (playerResponse?.team) {
          try {
            const eventsResponse = await getEvents();
            // Lọc events của team của player
            const playerEvents = eventsResponse.filter((event: any) => 
              event.team?.id === playerResponse.team.id
            );
            setEvents(playerEvents);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        }

                 // Lấy hoạt động gần đây
         try {
           const activitiesResponse = await getRecentActivityLogs(10);
           setActivities(activitiesResponse);
         } catch (error) {
           console.error('Error fetching activities:', error);
         }

      } catch (error) {
        console.error('Error fetching player data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <div>Đang tải thông tin...</div>
        <Spin />
      </div>
    );
  }
  
  if (!player) {
    return <Empty description="Không tìm thấy thông tin player" />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Thông tin cá nhân</Title>
      
      <Row gutter={24}>
        {/* Cột trái - Thông tin player (9/12) */}
        <Col xs={24} lg={18}>
          <Card title="Thông tin cơ bản" style={{ marginBottom: 16 }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ và tên">{player.fullName}</Descriptions.Item>
              <Descriptions.Item label="Tên trong game (IGN)">{player.ign}</Descriptions.Item>
              <Descriptions.Item label="Tài khoản game">{player.gameAccount}</Descriptions.Item>
              <Descriptions.Item label="Email">{player.user?.email}</Descriptions.Item>
              <Descriptions.Item label="Vị trí trong game">
                <Tag color="blue">{player.roleInGame?.name || 'Chưa cập nhật'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">{new Date(player.createdAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">{new Date(player.updatedAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Thông tin team nếu có */}
          {player.team && (
            <Card title="Thông tin team" style={{ marginBottom: 16 }}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Tên team">{player.team.name}</Descriptions.Item>
                <Descriptions.Item label="Mô tả">{player.team.description || 'Không có mô tả'}</Descriptions.Item>
                <Descriptions.Item label="Ngày tham gia">{new Date(player.team.createdAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
              </Descriptions>
            </Card>
          )}

          {/* Thông báo nếu không có team */}
          {!player.team && (
            <Card title="Trạng thái team" style={{ marginBottom: 16 }}>
              <Empty 
                description="Bạn chưa tham gia team nào"             image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </Col>

        {/* Cột phải - Sự kiện và hoạt động (3/12) */}
        <Col xs={24} lg={6}>
          {/* Sự kiện đã tham gia */}
          <Card title="Sự kiện đã tham gia" style={{ marginBottom: 16 }}>
            {events && events.length > 0 ? (
              <Timeline 
                items={events.map((ev: any) => ({
                  children: (
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{ev.title}</div>
                      <Tag color={ev.type === 'Thi đấu' ? 'blue' : 'green'} style={{ fontSize: '10px' }}>
                        {ev.type}
                      </Tag>
                      <div style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
                        {new Date(ev.startTime).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  )
                }))}
              />
            ) : (
              <Empty description="Chưa có sự kiện" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>

          {/* Hoạt động gần đây */}
          <Card title="Hoạt động gần đây">
            {activities && activities.length > 0 ? (
              <Timeline 
                items={activities.map((act: any) => ({
                  children: (
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{act.action}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>{act.description}</div>
                      <div style={{ color: '#999', fontSize: 10, marginTop: 2 }}>
                        {new Date(act.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  )
                }))}
              />
            ) : (
              <Empty description="Chưa có hoạt động" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlayerProfilePage; 