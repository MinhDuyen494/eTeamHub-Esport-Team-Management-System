import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, Divider, Button, Table, Statistic, Modal, Form, Input, Select, Tabs, Tag, Popconfirm, Upload, message, Space, Avatar, Empty, Spin
} from 'antd';
import { TeamOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../../api/teams.api';
import { getUsers } from '../../../api/users.api';

const { TabPane } = Tabs;

const TeamsAdmin: React.FC = () => {
  // State
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const role = user?.role?.name;
  
  
  
  if (role !== 'admin') {
    return <Empty description="Bạn không có quyền truy cập trang này." style={{ marginTop: 100 }} />;
  }
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, members: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTeam, setEditTeam] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTeam, setDetailTeam] = useState<any>(null);
  const [form] = Form.useForm();
  const [users, setUsers] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>({});

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers({ role: 'leader' });
      console.log('API getUsers response:', res);
      setUsers(res);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTeams = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const role = user?.role?.name || user?.role;
    let res: any[] = [];
    if (user && role === 'admin') {
      res = await getTeams();
      console.log('Fetched teams:', res);
    } else if (user && role === 'leader') {
      // res = await getTeamsByLeaderId(user.id);
    }
    setTeams(res);
    // Tính toán thống kê
    const total = res.length;
    const active = res.filter((t: any) => t.status === 'active').length;
    const inactive = res.filter((t: any) => t.status !== 'active').length;
    const members = res.reduce((sum: number, t: any) => sum + (t.members?.length || 0), 0);
    setStats({ total, active, inactive, members });
    setLoading(false);
  };

  const columns = [
    { title: 'Tên team', dataIndex: 'name', key: 'name' },
    {
      title: 'Leader',
      dataIndex: 'leader',
      key: 'leader',
      render: (leader: any) => leader?.email || <Tag color='red'>Chưa có</Tag>
    },
    {
      title: 'Thành viên',
      dataIndex: 'members',
      key: 'members',
      render: (members: any[]) => members?.length || 0
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string | number | Date) => new Date(date).toLocaleDateString()
    },
    
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<InfoCircleOutlined />} onClick={() => handleShowDetail(record)}>Chi tiết</Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title='Xác nhận xóa team?' onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const handleShowDetail = (team: any) => {
    setDetailTeam(team);
    setShowDetail(true);
    // fetch thêm detail nếu cần
  };

  const handleEdit = (team: any) => {
    console.log('Opening edit modal for team:', team);
    setEditTeam(team);
    setShowModal(true);
    // Map đúng các trường từ team object sang form fields
    const formData = {
      name: team.name,
      description: team.description,
      leaderId: team.leader?.id, // Quan trọng: lấy leader.id thay vì leader object
      logo: team.logo
    };
    console.log('Setting form values:', formData);
    form.setFieldsValue(formData);
    setFormValues(formData);
  };

  const handleDelete = async (id: any) => {
    await deleteTeam(id);
    message.success('Đã xóa team');
    fetchTeams();
  };

  const handleAdd = () => {
    setEditTeam(null);
    setShowModal(true);
    form.resetFields();
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    try {
      if (editTeam) {
        // Khi update, chỉ gửi name và description
        
        const updateData = {
          name: formValues.name || values.name,
          description: formValues.description || values.description
        };
        await updateTeam(editTeam.id, updateData);
        message.success('Cập nhật team thành công');
      } else {
        // Khi create, gửi tất cả bao gồm leaderId
        await createTeam(values);
        message.success('Tạo team thành công');
      }
      setShowModal(false);
      console.log('Fetching teams after update...');
      await fetchTeams();
      console.log('Teams fetched successfully');
    } catch (error) {
      message.error('Có lỗi xảy ra');
      console.error('Error:', error);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus ? team.status === filterStatus : true)
  );

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Divider orientation='left'><TeamOutlined /> Quản lý Teams (Admin)</Divider>
      {loading ? (
        <Spin style={{ marginTop: 100 }} />
      ) : (
        <>
          <Row gutter={24}>
            <Col xs={24} md={6}>
              <Card>
                <Statistic title='Tổng số team' value={stats.total} />
                <Statistic title='Team active' value={stats.active} style={{ marginTop: 16 }} />
                <Statistic title='Team inactive' value={stats.inactive} style={{ marginTop: 16 }} />
                <Statistic title='Tổng thành viên' value={stats.members} style={{ marginTop: 16 }} />
              </Card>
            </Col>
            <Col xs={24} md={18}>
              <Card
                title={
                  <Space>
                    <Input.Search placeholder='Tìm kiếm team...' onSearch={setSearch} style={{ width: 200 }} />
                    <Select placeholder='Trạng thái' allowClear style={{ width: 120 }} onChange={setFilterStatus}>
                      <Select.Option value='active'>Active</Select.Option>
                      <Select.Option value='inactive'>Inactive</Select.Option>
                    </Select>
                    <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>Thêm team</Button>
                  </Space>
                }
              >
                <Table
                  columns={columns}
                  dataSource={filteredTeams}
                  rowKey='id'
                  loading={loading}
                  pagination={{ pageSize: 8 }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Modal Add/Edit Team */}
      <Modal
        title={editTeam ? 'Sửa team' : 'Thêm team mới'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleModalOk}
        okText={editTeam ? 'Lưu' : 'Tạo'}
      >
        <Form form={form} layout='vertical' onValuesChange={(changedValues, allValues) => {
          setFormValues(allValues);
        }}>
          <Form.Item name='name' label='Tên team' rules={[{ required: true, message: 'Nhập tên team' }]}>
            <Input 
              value={formValues.name}
              onChange={(e) => {
                setFormValues({...formValues, name: e.target.value});
              }} 
            />
          </Form.Item>
          <Form.Item name='description' label='Mô tả'>
            <Input.TextArea 
              rows={3} 
              value={formValues.description}
              onChange={(e) => {
                setFormValues({...formValues, description: e.target.value});
              }} 
            />
          </Form.Item>
          {!editTeam && (
            <Form.Item name='leaderId' label='Leader' rules={[{ required: true, message: 'Chọn leader' }]}>
              <Select showSearch placeholder='Chọn leader'>
                {users.map((u: any) => (
                  <Select.Option key={u.id} value={u.id}>{u.email}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item name='logo' label='Logo'> <Upload beforeUpload={() => false} maxCount={1}> <Button>Upload logo</Button> </Upload> </Form.Item>
        </Form>
      </Modal>

      {/* Modal/Drawer Team Detail */}
      <Modal
        title='Chi tiết team'
        open={showDetail}
        onCancel={() => setShowDetail(false)}
        footer={null}
        width={800}
      >
        {detailTeam ? (
          <Tabs defaultActiveKey='info'>
            <TabPane tab='Thông tin' key='info'>
              <Card>
                <Avatar src={detailTeam.logo} size={64} icon={<TeamOutlined />} />
                <p><b>Tên team:</b> {detailTeam.name}</p>
                <p><b>Leader:</b> {detailTeam.leader?.fullname || detailTeam.leader?.email}</p>
                <p><b>Mô tả:</b> {detailTeam.description}</p>
                <p><b>Ngày tạo:</b> {new Date(detailTeam.createdAt).toLocaleDateString()}</p>
              </Card>
            </TabPane>
            <TabPane tab='Thành viên' key='members'> {/* Table/List thành viên, thao tác kick/add */} </TabPane>
            <TabPane tab='Lời mời' key='invites'> {/* List invites, thao tác gửi/hủy */} </TabPane>
            <TabPane tab='Activity log' key='activity'> {/* List activity log */} </TabPane>
          </Tabs>
        ) : <Spin />}
      </Modal>
    </div>
  );
};

export default TeamsAdmin;
