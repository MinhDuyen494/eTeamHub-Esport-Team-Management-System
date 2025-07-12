import React, { useState } from 'react';
import { Card, Form, Select, Button, Typography, Space, Divider, Switch, notification, Row, Col } from 'antd';
import { LogoutOutlined, GlobalOutlined, BellOutlined, SecurityScanOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Lấy ngôn ngữ hiện tại từ localStorage
  const currentLang = localStorage.getItem('lang') || 'vi';

  const handleLanguageChange = (value: string) => {
    localStorage.setItem('lang', value);
    notification.success({
      message: value === 'vi' ? 'Đã chuyển sang tiếng Việt' : 'Switched to English',
    });
    // Reload trang để áp dụng ngôn ngữ mới
    window.location.reload();
  };

  const handleLogout = () => {
    setLoading(true);
    // Xóa thông tin đăng nhập
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    notification.success({
      message: currentLang === 'vi' ? 'Đăng xuất thành công' : 'Logged out successfully',
    });
    
    setTimeout(() => {
      navigate('/auth');
    }, 1000);
  };

  const handleSaveSettings = (values: any) => {
    console.log('Settings saved:', values);
    notification.success({
      message: currentLang === 'vi' ? 'Đã lưu cài đặt' : 'Settings saved',
    });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Title level={2}>Settings</Title>
      
      <Form layout="vertical" onFinish={handleSaveSettings}>
        {/* Top Row - Language and Security Settings */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          {/* Language Settings Column */}
          <Col xs={24} md={12}>
            <Card title={<><GlobalOutlined /> Language Settings</>}>
              <Form.Item
                label={currentLang === 'vi' ? 'Ngôn ngữ' : 'Language'}
                name="language"
                initialValue={currentLang}
              >
                <Select onChange={handleLanguageChange}>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* Security Settings Column */}
          <Col xs={24} md={12}>
            <Card title={<><SecurityScanOutlined /> Security Settings</>}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="default" block>
                  {currentLang === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
                </Button>
                <Button type="default" block>
                  {currentLang === 'vi' ? 'Bảo mật 2 lớp' : 'Two-Factor Authentication'}
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Middle Row - Notification Settings */}
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title={<><BellOutlined /> Notification Settings</>}>
              <Row gutter={[24, 16]} justify="center" align="middle">
                <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Form.Item
                    label={currentLang === 'vi' ? 'Thông báo email' : 'Email notifications'}
                    name="emailNotifications"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Form.Item
                    label={currentLang === 'vi' ? 'Thông báo push' : 'Push notifications'}
                    name="pushNotifications"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Form.Item
                    label={currentLang === 'vi' ? 'Thông báo sự kiện' : 'Event notifications'}
                    name="eventNotifications"
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Bottom Row - Action Buttons */}
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              htmlType="submit"
              size="large"
              style={{ minWidth: 200 }}
            >
              {currentLang === 'vi' ? 'Lưu cài đặt' : 'Save Settings'}
            </Button>
          </Col>
          
          <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={loading}
              size="large"
              style={{ minWidth: 200 }}
            >
              {currentLang === 'vi' ? 'Đăng xuất' : 'Logout'}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Settings; 