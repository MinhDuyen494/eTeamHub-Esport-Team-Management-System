import React, { useEffect, useState } from 'react';
import { Row, Col, Card, List, Typography, Tag, Space, Button, Spin, Input, Select, Modal, Form, DatePicker, Checkbox, Pagination, notification } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, DownOutlined, UpOutlined, EditOutlined } from '@ant-design/icons';
import { useEvent } from '../../Context/EventContext';
import type { Event } from '../../Context/EventContext';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const EventPage: React.FC = () => {
  const { 
    state, 
    fetchEvents, 
    getEventStatus, 
    getUpcomingEvents, 
    getOngoingEvents, 
    getEndedEvents, 
    getSoonestEvent 
  } = useEvent();

  // State cho filter/search/sort
  const [searchTeam, setSearchTeam] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const [showMoreLeft, setShowMoreLeft] = useState({
    upcoming: false,
    ongoing: false,
    ended: false,
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [selectedEventsToDelete, setSelectedEventsToDelete] = useState<string[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [addForm] = Form.useForm<Event>();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deletePage, setDeletePage] = useState(1);
  const DELETE_PAGE_SIZE = 8;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editForm] = Form.useForm();
  const [loadingEdit, setLoadingEdit] = useState(false);

  useEffect(() => {
    fetchEvents();
    // Lấy danh sách team cho form thêm
    import('../../api/teams.api').then(api => {
      api.getTeams().then((data: any) => setTeams(data));
    });
  }, []);

  // Lấy các events theo trạng thái
  const upcomingEvents = getUpcomingEvents();
  const ongoingEvents = getOngoingEvents();
  const endedEvents = getEndedEvents();
  const soonestEvent = getSoonestEvent();

  // Group events by team name
  const eventsByTeam: Record<string, Event[]> = {};
  state.events.forEach(event => {
    const teamName = event.team?.name || 'Không rõ team';
    if (!eventsByTeam[teamName]) eventsByTeam[teamName] = [];
    eventsByTeam[teamName].push(event);
  });

  // Lọc theo team
  const filteredTeams = Object.keys(eventsByTeam).filter(teamName =>
    teamName.toLowerCase().includes(searchTeam.toLowerCase())
  );

  // Lấy tất cả loại sự kiện
  const allTypes = Array.from(new Set(state.events.map(e => e.type))).filter(Boolean);

  // Format date helper
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Sắp xếp sự kiện
  const sortEvents = (events: Event[]) => {
    return [...events].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      } else {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
    });
  };

  // Lọc theo loại
  const filterEventsByType = (events: Event[]) => {
    if (filterType === 'all') return events;
    return events.filter(e => e.type === filterType);
  };

  // Lọc theo team
  const filterEventsByTeam = (events: Event[]) => {
    if (!searchTeam) return events;
    return events.filter(e => (e.team?.name || '').toLowerCase().includes(searchTeam.toLowerCase()));
  };

  // Helper cho nút xem thêm bên trái (4 sự kiện)
  const getDisplayEventsLeft = (events: Event[], key: 'upcoming' | 'ongoing' | 'ended') => {
    const showAll = showMoreLeft[key];
    return showAll ? events : events.slice(0, 4);
  };

  // Lọc và sắp xếp events cho cả 2 bên
  const getFilteredAndSortedEvents = (events: Event[]) => {
    let filtered = filterEventsByTeam(filterEventsByType(events));
    return sortEvents(filtered);
  };

  // Lấy events đã lọc và sắp xếp cho từng loại
  const filteredUpcomingEvents = getFilteredAndSortedEvents(upcomingEvents);
  const filteredOngoingEvents = getFilteredAndSortedEvents(ongoingEvents);
  const filteredEndedEvents = getFilteredAndSortedEvents(endedEvents);
  const filteredSoonestEvent = filteredUpcomingEvents.length > 0 ? filteredUpcomingEvents[0] : null;

  // Thêm sự kiện
  const handleAddEvent = async (values: any) => {
    setLoadingAdd(true);
    try {
      const { createEvent } = await import('../../api/events.api');
      await createEvent({
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
      });
      setAddModalVisible(false);
      addForm.resetFields();
      fetchEvents();
      notification.success({
        message: 'Thêm sự kiện thành công',
      });
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Thêm sự kiện thất bại',
      });
      // handle error
    } finally {
      setLoadingAdd(false);
    }
  };

  // Xóa sự kiện
  const handleDeleteEvents = async () => {
    setLoadingDelete(true);
    try {
      const { deleteEvent } = await import('../../api/events.api');
      for (const id of selectedEventsToDelete) {
        await deleteEvent(id);
      }
      setDeleteModalVisible(false);
      setConfirmDeleteVisible(false);
      setSelectedEventsToDelete([]);
      fetchEvents();
      notification.success({
        message: 'Xóa sự kiện thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Xóa sự kiện thất bại',
      });
      // handle error
    } finally {
      setLoadingDelete(false);
    }
  };

  // Hàm mở modal sửa
  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setEditModalVisible(true);
    // Điền dữ liệu vào form
    editForm.setFieldsValue({
      ...event,
      startTime: moment(event.startTime),
      endTime: moment(event.endTime),
      teamId: event.team?.id,
    });
  };
  // Hàm submit sửa
  const handleEditEvent = async (values: any) => {
    if (!editingEvent) return;
    setLoadingEdit(true);
    try {
      const { updateEvent } = await import('../../api/events.api');
      await updateEvent(editingEvent.id.toString(), {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
      });
      setEditModalVisible(false);
      setEditingEvent(null);
      fetchEvents();
      notification.success({
        message: 'Sửa sự kiện thành công',
      });
    } catch (e) {
      notification.error({
        message: 'Sửa sự kiện thất bại',
      });
      // handle error
    } finally {
      setLoadingEdit(false);
    }
  };

  if (state.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu sự kiện...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="danger">Lỗi: {state.error}</Text>
        <br />
        <Button type="primary" onClick={fetchEvents} style={{ marginTop: 16 }}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Modal Thêm sự kiện */}
      <Modal
        title="Thêm sự kiện mới"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => addForm.submit()}
        confirmLoading={loadingAdd}
        okText="Thêm"
        cancelText="Hủy"
        width={700}
      >
        <Form form={addForm} layout="vertical" onFinish={handleAddEvent}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tên sự kiện" rules={[{ required: true, message: 'Nhập tên sự kiện' }]}
                style={{ marginBottom: 12 }}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: 'Nhập địa điểm' }]}
                style={{ marginBottom: 12 }}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="Thời gian bắt đầu" rules={[{ required: true, message: 'Chọn thời gian bắt đầu' }]}
                style={{ marginBottom: 12 }}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="Thời gian kết thúc" rules={[{ required: true, message: 'Chọn thời gian kết thúc' }]}
                style={{ marginBottom: 12 }}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại sự kiện" rules={[{ required: true, message: 'Chọn loại sự kiện' }]}
                style={{ marginBottom: 12 }}>
                <Select>
                  <Option value="Luyện tập">Luyện tập</Option>
                  <Option value="Thi đấu">Thi đấu</Option>
                  <Option value="Training">Training</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="teamId" label="Đội tham gia" rules={[{ required: true, message: 'Chọn đội' }]}
                style={{ marginBottom: 12 }}>
                <Select showSearch optionFilterProp="children">
                  {teams.map((team: any) => (
                    <Option key={team.id} value={team.id}>{team.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xóa sự kiện */}
      <Modal
        title="Xóa sự kiện"
        open={deleteModalVisible}
        onCancel={() => { setDeleteModalVisible(false); setDeletePage(1); }}
        onOk={() => setConfirmDeleteVisible(true)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ disabled: selectedEventsToDelete.length === 0 }}
        width={900}
      >
        <List
          dataSource={getFilteredAndSortedEvents([...state.events]).slice((deletePage-1)*DELETE_PAGE_SIZE, deletePage*DELETE_PAGE_SIZE)}
          renderItem={(item: Event) => (
            <List.Item style={{ alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <Checkbox
                checked={selectedEventsToDelete.includes(item.id.toString())}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedEventsToDelete(prev => [...prev, item.id.toString()]);
                  } else {
                    setSelectedEventsToDelete(prev => prev.filter(id => id !== item.id.toString()));
                  }
                }}
                style={{ marginRight: 18, transform: 'scale(1.3)' }}
              />
              <span style={{ flex: 1, fontWeight: 500 }}>{item.title}</span>
              <span style={{ color: '#888', fontSize: 13, marginLeft: 8 }}>{moment(item.startTime).format('DD/MM/YYYY HH:mm')}</span>
              <span style={{ color: '#aaa', fontSize: 13, marginLeft: 8 }}>{item.team?.name}</span>
            </List.Item>
          )}
        />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Pagination
            current={deletePage}
            pageSize={DELETE_PAGE_SIZE}
            total={getFilteredAndSortedEvents([...state.events]).length}
            onChange={setDeletePage}
            showSizeChanger={false}
          />
        </div>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={confirmDeleteVisible}
        onCancel={() => setConfirmDeleteVisible(false)}
        onOk={handleDeleteEvents}
        okText="Xóa"
        cancelText="Hủy"
        confirmLoading={loadingDelete}
      >
        <Text>Bạn có chắc chắn muốn xóa {selectedEventsToDelete.length} sự kiện đã chọn không?</Text>
      </Modal>

      {/* Modal Sửa sự kiện */}
      <Modal
        title="Sửa sự kiện"
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); setEditingEvent(null); }}
        onOk={() => editForm.submit()}
        confirmLoading={loadingEdit}
        okText="Lưu"
        cancelText="Hủy"
        width={700}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditEvent}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Tên sự kiện" rules={[{ required: true, message: 'Nhập tên sự kiện' }]} style={{ marginBottom: 12 }}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Địa điểm" rules={[{ required: true, message: 'Nhập địa điểm' }]} style={{ marginBottom: 12 }}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="Thời gian bắt đầu" rules={[{ required: true, message: 'Chọn thời gian bắt đầu' }]} style={{ marginBottom: 12 }}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="Thời gian kết thúc" rules={[{ required: true, message: 'Chọn thời gian kết thúc' }]} style={{ marginBottom: 12 }}>
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại sự kiện" rules={[{ required: true, message: 'Chọn loại sự kiện' }]} style={{ marginBottom: 12 }}>
                <Select>
                  <Option value="Luyện tập">Luyện tập</Option>
                  <Option value="Thi đấu">Thi đấu</Option>
                  <Option value="Training">Training</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="teamId" label="Đội tham gia" rules={[{ required: true, message: 'Chọn đội' }]} style={{ marginBottom: 12 }}>
                <Select showSearch optionFilterProp="children">
                  {teams.map((team: any) => (
                    <Option key={team.id} value={team.id}>{team.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Row gutter={24}>
      {/* Bên trái: Sự kiện sắp diễn ra & đã kết thúc */}
      <Col xs={24} md={15} lg={16}>
        {/* Sự kiện sắp diễn ra sớm nhất - nổi bật */}
        {filteredSoonestEvent && (
          <Card style={{ marginBottom: 24, minHeight: 220, position: 'relative', overflow: 'hidden', paddingLeft: 16 }}>
            {/* Số thứ tự nhỏ, trên cùng bên trái */}
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 8,
                fontSize: 32,
                fontWeight: 700,
                color: '#1890ff',
                opacity: 0.7,
                zIndex: 2,
                background: 'rgba(255,255,255,0.7)',
                borderRadius: 8,
                padding: '0 8px',
                userSelect: 'none',
              }}
            >
              #{filteredSoonestEvent.id}
            </div>
            <Row align="middle" justify="space-between" style={{ zIndex: 2, position: 'relative' }}>
              <Col flex="auto" style={{ marginLeft: 32, minWidth: 0 }}>
                <Title level={3} style={{ marginBottom: 8, fontSize: 28 }}>{filteredSoonestEvent.title}</Title>
                {/* Ngày bắt đầu - kết thúc dưới title */}
                <Text type="secondary" style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>
                  <span role="img" aria-label="calendar">🗓️</span> {formatDate(filteredSoonestEvent.startTime)} - {formatDate(filteredSoonestEvent.endTime)}
                </Text>
                <Paragraph style={{ fontSize: 15, marginBottom: 8 }}>{filteredSoonestEvent.description}</Paragraph>
                <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>
                  📍 {filteredSoonestEvent.location} | 🏷️ {filteredSoonestEvent.type}
                </Text>
                {/* Thời gian ở dưới cùng */}
                <div style={{ marginTop: 16 }}>
                  <Text strong style={{ fontSize: 15 }}>
                    <span role="img" aria-label="clock">⏰</span> Thời gian bắt đầu: {formatDateTime(filteredSoonestEvent.startTime)}
                  </Text>
                </div>
                {/* Đội tham gia */}
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Đội tham gia: <b>{filteredSoonestEvent.team?.name || 'Không rõ team'}</b>
                  </Text>
                </div>
                {filteredSoonestEvent.note && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      📝 {filteredSoonestEvent.note}
                    </Text>
                  </div>
                )}
              </Col>
              <Col>
                <Tag color="blue" style={{ fontSize: 18, padding: '8px 22px', borderRadius: 8, fontWeight: 600 }}>
                  Sắp diễn ra
                </Tag>
              </Col>
            </Row>
            {/* Nút Sửa ở góc dưới bên phải */}
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ position: 'absolute', right: 24, bottom: 24, zIndex: 3 }}
              onClick={() => openEditModal(filteredSoonestEvent)}
            >
              Sửa
            </Button>
          </Card>
        )}

        {/* Các sự kiện sắp diễn ra còn lại */}
        {filteredUpcomingEvents.length > 1 && (
          <Card title={<Title level={4}>Sự kiện sắp diễn ra khác ({filteredUpcomingEvents.length - 1})</Title>} style={{ marginBottom: 24 }}>
            <List
              dataSource={getDisplayEventsLeft(filteredUpcomingEvents.filter(event => event.id !== filteredSoonestEvent?.id), 'upcoming')}
              locale={{ emptyText: 'Không có sự kiện sắp diễn ra khác.' }}
              renderItem={(item: Event) => (
                <List.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 600, color: '#1890ff', marginRight: 16, minWidth: 36, textAlign: 'center' }}>#{item.id}</div>
                    <div style={{ flex: 1 }}>
                      <Text strong>{item.title}</Text>
                      <div>
                        <Text type="secondary">Thời gian: {formatDateTime(item.startTime)}</Text>
                      </div>
                      <div>
                        <Text type="secondary">📍 {item.location} | 🏷️ {item.type}</Text>
                      </div>
                      {/* Đội tham gia */}
                      <div>
                        <Text type="secondary">Đội tham gia: <b>{item.team?.name || 'Không rõ team'}</b></Text>
                      </div>
                    </div>
                  </div>
                  <Tag color="blue" style={{ fontSize: 15, padding: '6px 18px', borderRadius: 8, fontWeight: 500 }}>Sắp diễn ra</Tag>
                  {/* Nút Sửa ở góc dưới bên phải của item */}
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    style={{ position: 'absolute', right: 12, bottom: 8, zIndex: 2 }}
                    onClick={() => openEditModal(item)}
                  >
                    Sửa
                  </Button>
                </List.Item>
              )}
            />
            {filteredUpcomingEvents.filter(event => event.id !== filteredSoonestEvent?.id).length > 4 && (
              <Button
                type="link"
                icon={showMoreLeft.upcoming ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setShowMoreLeft(prev => ({ ...prev, upcoming: !prev.upcoming }))}
                style={{ paddingLeft: 0 }}
              >
                {showMoreLeft.upcoming ? 'Ẩn bớt' : 'Xem thêm'}
              </Button>
            )}
          </Card>
        )}

        {/* Sự kiện đang diễn ra */}
        {filteredOngoingEvents.length > 0 && (
          <Card title={<Title level={4}>Sự kiện đang diễn ra ({filteredOngoingEvents.length})</Title>} style={{ marginBottom: 24 }}>
            <List
              dataSource={getDisplayEventsLeft(filteredOngoingEvents, 'ongoing')}
              renderItem={(item: Event) => (
                <List.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 600, color: '#52c41a', marginRight: 16, minWidth: 36, textAlign: 'center' }}>#{item.id}</div>
                    <div style={{ flex: 1 }}>
                      <Text strong>{item.title}</Text>
                      <div>
                        <Text type="secondary">Thời gian: {formatDateTime(item.startTime)}</Text>
                      </div>
                      <div>
                        <Text type="secondary">📍 {item.location} | 🏷️ {item.type}</Text>
                      </div>
                      {/* Đội tham gia */}
                      <div>
                        <Text type="secondary">Đội tham gia: <b>{item.team?.name || 'Không rõ team'}</b></Text>
                      </div>
                    </div>
                  </div>
                  <Tag color="success" style={{ fontSize: 15, padding: '6px 18px', borderRadius: 8, fontWeight: 500 }}>Đang diễn ra</Tag>
                </List.Item>
              )}
            />
            {filteredOngoingEvents.length > 4 && (
              <Button
                type="link"
                icon={showMoreLeft.ongoing ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setShowMoreLeft(prev => ({ ...prev, ongoing: !prev.ongoing }))}
                style={{ paddingLeft: 0 }}
              >
                {showMoreLeft.ongoing ? 'Ẩn bớt' : 'Xem thêm'}
              </Button>
            )}
          </Card>
        )}

        {/* Sự kiện đã kết thúc */}
        <Card title={<Title level={4}>Sự kiện đã kết thúc ({filteredEndedEvents.length})</Title>}>
          <List
            dataSource={getDisplayEventsLeft(filteredEndedEvents, 'ended')}
            locale={{ emptyText: 'Không có sự kiện đã kết thúc.' }}
            renderItem={(item: Event) => (
              <List.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: '#aaa', marginRight: 16, minWidth: 36, textAlign: 'center' }}>#{item.id}</div>
                  <div style={{ flex: 1 }}>
                    <Text strong>{item.title}</Text>
                    <div>
                      <Text type="secondary">Thời gian: {formatDateTime(item.startTime)}</Text>
                    </div>
                    <div>
                      <Text type="secondary">📍 {item.location} | 🏷️ {item.type}</Text>
                    </div>
                    {/* Đội tham gia */}
                    <div>
                      <Text type="secondary">Đội tham gia: <b>{item.team?.name || 'Không rõ team'}</b></Text>
                    </div>
                  </div>
                </div>
                <Tag color="default" style={{ fontSize: 15, padding: '6px 18px', borderRadius: 8, fontWeight: 500 }}>Đã kết thúc</Tag>
              </List.Item>
            )}
          />
          {filteredEndedEvents.length > 4 && (
            <Button
              type="link"
              icon={showMoreLeft.ended ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setShowMoreLeft(prev => ({ ...prev, ended: !prev.ended }))}
              style={{ paddingLeft: 0 }}
            >
              {showMoreLeft.ended ? 'Ẩn bớt' : 'Xem thêm'}
            </Button>
          )}
        </Card>
      </Col>

      {/* Bên phải: Thống kê sự kiện 1 hàng ngang + 2 nút + filter/search + Card cho từng team */}
      <Col xs={24} md={9} lg={8}>
        {/* Thống kê sự kiện 1 hàng ngang */}
        <Card style={{ marginBottom: 16, background: '#f6faff' }}>
          <Row gutter={8} justify="center">
            <Col span={8} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>{filteredUpcomingEvents.length}</div>
              <Text type="secondary">Sắp diễn ra</Text>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>{filteredOngoingEvents.length}</div>
              <Text type="secondary">Đang diễn ra</Text>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#aaa' }}>{filteredEndedEvents.length}</div>
              <Text type="secondary">Đã kết thúc</Text>
            </Col>
          </Row>
        </Card>
        {/* 2 nút Thêm/Xóa sự kiện */}
        <Row gutter={8} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Button type="primary" icon={<PlusOutlined />} block onClick={() => setAddModalVisible(true)}>Thêm sự kiện</Button>
          </Col>
          <Col span={12}>
            <Button danger icon={<DeleteOutlined />} block onClick={() => setDeleteModalVisible(true)}>Xóa sự kiện</Button>
          </Col>
        </Row>
        {/* Tìm kiếm, filter, sort */}
        <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: 12 }}>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo tên đội"
            value={searchTeam}
            onChange={e => setSearchTeam(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <Row gutter={8}>
            <Col span={12}>
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả loại</Option>
                {allTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Select
                value={sortOrder}
                onChange={v => setSortOrder(v)}
                style={{ width: '100%' }}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
              </Select>
            </Col>
          </Row>
        </Card>
        {/* Danh sách team (mỗi team 1 card) */}
        {filteredTeams.map(teamName => {
          let events = eventsByTeam[teamName] || [];
          events = filterEventsByType(events);
          events = sortEvents(events);
          const showAll = showMore[teamName] || false;
          const displayEvents = showAll ? events : events.slice(0, 2);
          return (
            <Card key={teamName} title={<Title level={5} style={{ margin: 0 }}>Đội: {teamName}</Title>} style={{ marginBottom: 16 }}>
              <List
                dataSource={displayEvents}
                renderItem={(item: Event) => (
                  <List.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <Text strong>{item.title}</Text>
                      <div>
                        <Text type="secondary">{formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}</Text>
                      </div>
                      {/* Đội tham gia */}
                      <div>
                        <Text type="secondary">Đội tham gia: <b>{item.team?.name || 'Không rõ team'}</b></Text>
                      </div>
                    </div>
                    <Tag color={getEventStatus(item) === 'upcoming' ? 'blue' : getEventStatus(item) === 'ongoing' ? 'success' : 'default'}>
                      {getEventStatus(item) === 'upcoming' ? 'Sắp diễn ra' : getEventStatus(item) === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
                    </Tag>
                  </List.Item>
                )}
              />
              {events.length > 2 && (
                <Button
                  type="link"
                  icon={showAll ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setShowMore(prev => ({ ...prev, [teamName]: !showAll }))}
                  style={{ paddingLeft: 0 }}
                >
                  {showAll ? 'Ẩn bớt' : 'Xem thêm'}
                </Button>
              )}
            </Card>
          );
        })}
      </Col>
    </Row>
    </>
  );
};

export default EventPage;
