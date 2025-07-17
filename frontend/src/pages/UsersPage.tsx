import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Button, Modal, Form, Input, Select, Space, message, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAllUsers, createUser, deleteUser } from '../api/users.api';

const { Title } = Typography;
const { Option } = Select;

// Mock data cho roles
const roleOptions = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'leader' },
  { id: 3, name: 'player' },
];

// Hàm tạo màu cố định từ tên team
function getTeamColor(team: string | null): string {
  if (!team) return 'magenta'; // Tự do
  // Danh sách màu đẹp, đủ dùng cho nhiều team
  const colors = [
    'geekblue', 'volcano', 'cyan', 'gold', 'lime', 'purple', 'orange', 'green', 'blue', 'red', 'yellow', 'pink', 'teal', 'brown', 'gray', 'processing', 'success', 'warning', 'error',
  ];
  // Hash tên team thành số
  let hash = 0;
  for (let i = 0; i < team.length; i++) {
    hash = team.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % colors.length;
  return colors[idx];
}

// Hàm tạo màu cho role
function getRoleColor(role: string): string {
  const roleColors: { [key: string]: string } = {
    'admin': 'red',
    'leader': 'gold',
    'player': 'blue',
  };
  return roleColors[role] || 'default';
}



const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [addUserModal, setAddUserModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('player');
  const [form] = Form.useForm();

  // Fetch users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setTableLoading(true);
    try {
      // Test với endpoint không cần auth trước
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách users!');
    } finally {
      setTableLoading(false);
    }
  };

  const handleAddUser = () => {
    setAddUserModal(true);
    form.resetFields();
    setSelectedRole('player');
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    // Reset các trường game nếu chuyển sang admin/leader
    if (role === 'admin' || role === 'leader') {
      form.setFieldsValue({
        ign: '',
        gameAccount: '',
        roleInGameId: undefined,
      });
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const userData = {
        email: values.email,
        password: values.password, // gửi raw password, backend sẽ tự hash
        role_id: values.role_id,
      };
      await createUser(userData);
      message.success('Thêm user thành công!');
      setAddUserModal(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Có lỗi xảy ra khi thêm user!');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm handleDeleteUser với modal xác nhận xóa user
  const handleDeleteUser = (userId: number | string) => {
    Modal.confirm({
      title: 'Xác nhận xóa user?',
      content: 'Bạn có chắc chắn muốn xóa user này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteUser(String(userId));
          message.success('Đã xóa user thành công!');
          fetchUsers();
        } catch (error) {
          message.error('Xóa user thất bại!');
        }
      },
    });
  };

  // Định nghĩa lại columns bên trong component để dùng handleDeleteUser
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
      width: 100,
      render: (roleName: string) => (
        <Tag color={getRoleColor(roleName)} style={{ fontWeight: 'bold' }}>
          {roleName?.toUpperCase() || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Team',
      dataIndex: ['player', 'team', 'name'],
      key: 'team',
      width: 120,
      render: (_: any, record: any) => {
        // Ưu tiên lấy team ngoài nếu là leader
        const team = record.team || (record.player && record.player.team);
        return (
          <Tag color={getTeamColor(team?.name)} style={{ fontWeight: 'bold', fontSize: 12 }}>
            {team?.name ? team.name : 'Tự do'}
          </Tag>
        );
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => Modal.info({
            title: 'Thông báo',
            content: 'Chức năng sẽ cập nhật sớm',
            okText: 'Đóng',
          })}>
            Sửa
          </Button>
          <Button danger size="small" onClick={() => handleDeleteUser(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Danh sách Users</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddUser}
          size="large"
        >
          Thêm User
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        bordered
        loading={tableLoading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1000 }} // Giảm width vì đã bỏ 1 cột
      />

      {/* Modal thêm user */}
      <Modal
        title="Thêm User Mới"
        open={addUserModal}
        onCancel={() => setAddUserModal(false)}
        footer={null}
        width={700} // Tăng width để chứa 3 cột
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            role: 'player',
          }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirm-password"
            label="Xác nhận mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item
            name="role_id"
            label="Role hệ thống"
            rules={[{ required: true, message: 'Vui lòng chọn role!' }]}
          >
            <Select 
              placeholder="Chọn role"
              onChange={value => setSelectedRole(value)}
            >
              {roleOptions.map(role => (
                <Option key={role.id} value={role.id}>{role.name.charAt(0).toUpperCase() + role.name.slice(1)}</Option>
              ))}
            </Select>
          </Form.Item>

          

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setAddUserModal(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage; 