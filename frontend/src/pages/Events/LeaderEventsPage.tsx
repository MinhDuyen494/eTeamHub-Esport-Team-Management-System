import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Tooltip,
  Badge,
  Empty
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { createEvent, updateEvent, deleteEvent } from '../../api/events.api';
import { useEvent } from '../../Context/EventContext';
import type { Event } from '../../Context/EventContext';
import { getTeams } from '../../api/teams.api'; // hoặc API phù hợp

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const LeaderEventsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    todayEvents: 0
  });

  // Sử dụng EventContext
  const { state: eventState, fetchEvents } = useEvent();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userInfo = JSON.parse(userData);
      setUser(userInfo);

      // Lấy team của leader từ API
      const fetchLeaderTeam = async () => {
        // Nếu userInfo có teamId/teamName thì dùng luôn, hoặc fetch từ API
        if (userInfo.teamId && userInfo.teamName) {
          setUserTeam({ id: userInfo.teamId, name: userInfo.teamName });
        } else {
          // Nếu không có, fetch từ API
          const teams = await getTeams();
          const myTeam = teams.find((t: any) => t.leader?.id === userInfo.id);
          if (myTeam) setUserTeam({ id: myTeam.id, name: myTeam.name });
        }
      };
      fetchLeaderTeam();
    }

    fetchEvents();
  }, []);

  // Fetch data khi userTeam đã được set và events đã được load
  useEffect(() => {
    if (userTeam && !eventState.loading) {
      fetchData();
    }
  }, [userTeam, eventState.events, eventState.loading]);

  const fetchData = async () => {
    if (!userTeam) return;
    
    try {
      // Filter events chỉ của team leader
      const teamEvents = eventState.events.filter(event => event.team.id === userTeam.id);
      
      // Calculate stats
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      
      // Tổng số events: tất cả events của team (kể cả đã kết thúc)
      const totalEvents = teamEvents.length;
      
      // Events sắp diễn ra: chưa bắt đầu
      const upcomingEvents = teamEvents.filter(event => new Date(event.startTime) > now).length;
      
      // Events hôm nay: diễn ra trong ngày hôm nay
      const todayEvents = teamEvents.filter(event => {
        const eventStartDate = new Date(event.startTime);
        const eventEndDate = new Date(event.endTime);
        return eventStartDate < tomorrow && eventEndDate >= today;
      }).length;
      
      setStats({
        totalEvents,
        upcomingEvents,
        todayEvents
      });
    } catch (error) {
      message.error('Không thể tải dữ liệu events');
    }
  };

  const handleCreate = () => {
    setEditingEvent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Event) => {
    setEditingEvent(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      location: record.location,
      timeRange: [dayjs(record.startTime), dayjs(record.endTime)],
      type: record.type,
      note: record.note,
      teamId: record.team.id
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent(id.toString());
      message.success('Xóa event thành công');
      fetchData();
    } catch (error) {
      message.error('Không thể xóa event');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const [startTime, endTime] = values.timeRange;
      const eventData = {
        title: values.title,
        description: values.description,
        location: values.location,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        type: values.type,
        note: values.note,
        teamId: userTeam.id // Chỉ tạo cho team của leader
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id.toString(), eventData);
        message.success('Cập nhật event thành công');
      } else {
        await createEvent(eventData);
        message.success('Tạo event thành công');
      }
      
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Luyện tập': return 'blue';
      case 'Thi đấu': return 'red';
      case 'Họp': return 'green';
      default: return 'default';
    }
  };

  const getEventStatusDisplay = (event: Event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    if (now < startTime) return { status: 'upcoming', text: 'Sắp diễn ra', color: 'processing' };
    if (now >= startTime && now <= endTime) return { status: 'ongoing', text: 'Đang diễn ra', color: 'success' };
    return { status: 'completed', text: 'Đã kết thúc', color: 'default' };
  };

  // Filter events chỉ của team leader
  const teamEvents = eventState.events.filter(event => event.team.id === userTeam?.id);

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Event) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          {record.description && (
            <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
          )}
        </div>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getEventTypeColor(type)}>{type}</Tag>
      )
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (record: Event) => (
        <div>
          <div>
            <ClockCircleOutlined /> {dayjs(record.startTime).format('DD/MM/YYYY HH:mm')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(record.endTime).format('HH:mm')}
          </div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record: Event) => {
        const status = getEventStatusDisplay(record);
        return (
          <Badge status={status.color as any} text={status.text} />
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: Event) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa event này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (!userTeam) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Empty 
          description="Bạn chưa có team để quản lý. Vui lòng tạo team trước." 
          style={{ marginTop: 100 }}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, marginBottom: '16px' }}>
          <CalendarOutlined style={{ marginRight: '8px' }} />
          Quản lý Events - {userTeam.name}
        </h1>
        
        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng số Events"
                value={stats.totalEvents}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Events sắp diễn ra"
                value={stats.upcomingEvents}
                valueStyle={{ color: '#1890ff' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Events hôm nay"
                value={stats.todayEvents}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ marginBottom: '16px' }}
        >
          Tạo Event mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teamEvents}
        rowKey="id"
        loading={eventState.loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} events`
        }}
      />

      <Modal
        title={editingEvent ? 'Sửa Event' : 'Tạo Event mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề event" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Nhập mô tả event" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
          >
            <Input placeholder="Nhập địa điểm" />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại event"
            rules={[{ required: true, message: 'Vui lòng chọn loại event' }]}
          >
            <Select placeholder="Chọn loại event">
              <Select.Option value="Luyện tập">Luyện tập</Select.Option>
              <Select.Option value="Thi đấu">Thi đấu</Select.Option>
              <Select.Option value="Họp">Họp</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <TextArea rows={2} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingEvent ? 'Cập nhật' : 'Tạo'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeaderEventsPage; 