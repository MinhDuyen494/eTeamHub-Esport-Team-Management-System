import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Tag,
  Typography,
  Empty,
  Spin,
  Badge,
  Space,
  Button,
  Modal,
  Descriptions
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEvent } from '../../Context/EventContext';
import { getTeamById } from '../../api/teams.api';
import { getMyPlayer } from '../../api/players.api';
import type { Event } from '../../Context/EventContext';

const { Title, Text, Paragraph } = Typography;

const PlayerEventsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDetailModal, setEventDetailModal] = useState(false);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    todayEvents: 0
  });
  const [loading, setLoading] = useState(true);

  // Sử dụng EventContext
  const { state: eventState, fetchEvents } = useEvent();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userTeam && eventState.events.length > 0) {
      calculateStats();
    }
  }, [userTeam, eventState.events]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get user from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const userInfo = JSON.parse(userData);
        setUser(userInfo);
        
        // Fetch player profile to get team information
        const playerResponse = await getMyPlayer();
        if (playerResponse.player && playerResponse.player.team) {
          setUserTeam(playerResponse.player.team);
        }
      }
      
      // Fetch all events
      await fetchEvents();
    } catch (error) {
      console.error('Không thể tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (!userTeam) return;

    // Filter events chỉ của team player
    const teamEvents = eventState.events.filter(event => event.team.id === userTeam.id);
    
    // Calculate stats
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const upcomingEvents = teamEvents.filter(event => new Date(event.startTime) > now).length;
    const todayEvents = teamEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= today && eventDate < tomorrow;
    }).length;
    
    setStats({
      totalEvents: teamEvents.length,
      upcomingEvents,
      todayEvents
    });
  };

  const getEventStatusDisplay = (event: Event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    if (now < startTime) return { status: 'upcoming', text: 'Sắp diễn ra', color: 'processing' };
    if (now >= startTime && now <= endTime) return { status: 'ongoing', text: 'Đang diễn ra', color: 'success' };
    return { status: 'completed', text: 'Đã kết thúc', color: 'default' };
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Luyện tập': return 'blue';
      case 'Thi đấu': return 'red';
      case 'Họp': return 'green';
      default: return 'default';
    }
  };

  const formatDateTime = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const showEventDetail = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailModal(true);
  };

  // Check if user has a team
  if (!userTeam) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Empty 
          description="Bạn chưa thuộc team nào. Vui lòng liên hệ leader để được thêm vào team." 
          style={{ marginTop: 100 }}
        />
      </div>
    );
  }

  if (loading || eventState.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu sự kiện...</div>
      </div>
    );
  }

  // Filter events chỉ của team player
  const teamEvents = eventState.events.filter(event => event.team.id === userTeam.id);

  // Phân loại events theo trạng thái
  const upcomingEvents = teamEvents.filter(event => new Date(event.startTime) > new Date());
  const ongoingEvents = teamEvents.filter(event => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    return now >= startTime && now <= endTime;
  });
  const completedEvents = teamEvents.filter(event => new Date(event.endTime) < new Date());

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, marginBottom: '16px' }}>
          <CalendarOutlined style={{ marginRight: '8px' }} />
          Sự kiện của Team - {userTeam?.name}
        </Title>
        
        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                  {stats.totalEvents}
                </div>
                <Text type="secondary">Tổng số Events</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                  {stats.upcomingEvents}
                </div>
                <Text type="secondary">Events sắp diễn ra</Text>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                  {stats.todayEvents}
                </div>
                <Text type="secondary">Events hôm nay</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Sự kiện sắp diễn ra */}
      {upcomingEvents.length > 0 && (
        <Card 
          title={
            <Space>
              <CalendarOutlined />
              <span>Sự kiện sắp diễn ra ({upcomingEvents.length})</span>
            </Space>
          } 
          style={{ marginBottom: '24px' }}
        >
          <List
            dataSource={upcomingEvents}
            renderItem={(event: Event) => (
              <List.Item 
                style={{ 
                  padding: '16px', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '8px', 
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
                onClick={() => showEventDetail(event)}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <Title level={4} style={{ margin: 0 }}>{event.title}</Title>
                    <Space>
                      <Tag color={getEventTypeColor(event.type)}>{event.type}</Tag>
                      <Badge status="processing" text="Sắp diễn ra" />
                    </Space>
                  </div>
                  
                  {event.description && (
                    <Paragraph style={{ marginBottom: '8px', color: '#666' }}>
                      {event.description}
                    </Paragraph>
                  )}
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>Bắt đầu: {formatDateTime(event.startTime)}</Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>Kết thúc: {formatDateTime(event.endTime)}</Text>
                      </Space>
                    </Col>
                  </Row>
                  
                  {event.location && (
                    <div style={{ marginTop: '8px' }}>
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{event.location}</Text>
                      </Space>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Sự kiện đang diễn ra */}
      {ongoingEvents.length > 0 && (
        <Card 
          title={
            <Space>
              <CalendarOutlined />
              <span>Sự kiện đang diễn ra ({ongoingEvents.length})</span>
            </Space>
          } 
          style={{ marginBottom: '24px' }}
        >
          <List
            dataSource={ongoingEvents}
            renderItem={(event: Event) => (
              <List.Item 
                style={{ 
                  padding: '16px', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '8px', 
                  marginBottom: '12px',
                  cursor: 'pointer',
                  backgroundColor: '#f6ffed'
                }}
                onClick={() => showEventDetail(event)}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <Title level={4} style={{ margin: 0 }}>{event.title}</Title>
                    <Space>
                      <Tag color={getEventTypeColor(event.type)}>{event.type}</Tag>
                      <Badge status="success" text="Đang diễn ra" />
                    </Space>
                  </div>
                  
                  {event.description && (
                    <Paragraph style={{ marginBottom: '8px', color: '#666' }}>
                      {event.description}
                    </Paragraph>
                  )}
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>Bắt đầu: {formatDateTime(event.startTime)}</Text>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>Kết thúc: {formatDateTime(event.endTime)}</Text>
                      </Space>
                    </Col>
                  </Row>
                  
                  {event.location && (
                    <div style={{ marginTop: '8px' }}>
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{event.location}</Text>
                      </Space>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* Sự kiện đã kết thúc */}
      <Card 
        title={
          <Space>
            <CalendarOutlined />
            <span>Sự kiện đã kết thúc ({completedEvents.length})</span>
          </Space>
        }
      >
        {completedEvents.length > 0 ? (
          <List
            dataSource={completedEvents.slice(0, 10)} // Chỉ hiển thị 10 sự kiện gần nhất
            renderItem={(event: Event) => (
              <List.Item 
                style={{ 
                  padding: '12px', 
                  border: '1px solid #f0f0f0', 
                  borderRadius: '6px', 
                  marginBottom: '8px',
                  cursor: 'pointer',
                  opacity: 0.7
                }}
                onClick={() => showEventDetail(event)}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <Text strong>{event.title}</Text>
                    <Space>
                      <Tag color={getEventTypeColor(event.type)}>{event.type}</Tag>
                      <Badge status="default" text="Đã kết thúc" />
                    </Space>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <ClockCircleOutlined />
                      <Text type="secondary">{formatDate(event.startTime)}</Text>
                    </Space>
                    {event.location && (
                      <Space>
                        <EnvironmentOutlined />
                        <Text type="secondary">{event.location}</Text>
                      </Space>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Chưa có sự kiện nào đã kết thúc" />
        )}
      </Card>

      {/* Modal chi tiết sự kiện */}
      <Modal
        title="Chi tiết sự kiện"
        open={eventDetailModal}
        onCancel={() => setEventDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setEventDetailModal(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedEvent && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tên sự kiện">
              <Text strong>{selectedEvent.title}</Text>
            </Descriptions.Item>
            
            {selectedEvent.description && (
              <Descriptions.Item label="Mô tả">
                {selectedEvent.description}
              </Descriptions.Item>
            )}
            
            <Descriptions.Item label="Loại sự kiện">
              <Tag color={getEventTypeColor(selectedEvent.type)}>{selectedEvent.type}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="Thời gian bắt đầu">
              {formatDateTime(selectedEvent.startTime)}
            </Descriptions.Item>
            
            <Descriptions.Item label="Thời gian kết thúc">
              {formatDateTime(selectedEvent.endTime)}
            </Descriptions.Item>
            
            {selectedEvent.location && (
              <Descriptions.Item label="Địa điểm">
                {selectedEvent.location}
              </Descriptions.Item>
            )}
            
            <Descriptions.Item label="Team">
              <Tag icon={<TeamOutlined />} color="blue">{selectedEvent.team.name}</Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="Trạng thái">
              {(() => {
                const status = getEventStatusDisplay(selectedEvent);
                return <Badge status={status.color as any} text={status.text} />;
              })()}
            </Descriptions.Item>
            
            {selectedEvent.note && (
              <Descriptions.Item label="Ghi chú">
                {selectedEvent.note}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PlayerEventsPage; 