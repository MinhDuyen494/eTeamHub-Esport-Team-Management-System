import React from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { createPlayer } from '../../api/players.api';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/users.api';

const { Option } = Select;

const CreatePlayerProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await createPlayer(values);
      message.success('Tạo hồ sơ tuyển thủ thành công!');
      // Fetch lại profile và cập nhật localStorage
      const res = await getProfile();
      localStorage.setItem('user', JSON.stringify(res.user));
      navigate('/dashboard');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Tạo hồ sơ thất bại');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 32, background: '#fff', borderRadius: 8 }}>
      <h2>Tạo hồ sơ tuyển thủ</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="ign" label="Tên trong game (IGN)" rules={[{ required: true, message: 'Nhập IGN' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gameAccount" label="Tài khoản game" rules={[{ required: true, message: 'Nhập tài khoản game' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="roleInGame" label="Vai trò trong game" rules={[{ required: true, message: 'Chọn vai trò' }]}>
          <Select>
            <Option value="ADC">ADC</Option>
            <Option value="Support">Support</Option>
            <Option value="Mid">Mid</Option>
            <Option value="Top">Top</Option>
            <Option value="Jungle">Jungle</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo hồ sơ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePlayerProfilePage;
