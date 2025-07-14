import React from 'react';
import { Card, Form, Select, Button, Typography, Space, Divider, Switch, Row, Col, Modal, Input } from 'antd';
import { LogoutOutlined, GlobalOutlined, BellOutlined, SecurityScanOutlined, SaveOutlined, LockOutlined } from '@ant-design/icons';
import { useSettings } from '../Context/SettingsContext';
import { getCurrentLanguage } from '../utils/language';
import '../css/settings.css';

const { Title } = Typography;
const { Option } = Select;
const { Password } = Input;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  
  const {
    changePasswordModalVisible,
    loading,
    changePasswordLoading,
    notificationSettings,
    updateNotificationSetting,
    handleLogout,
    handleSaveSettings,
    showChangePasswordModal,
    handleChangePassword,
    handleCancelChangePassword,
  } = useSettings();

  // Lấy ngôn ngữ hiện tại từ localStorage
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (value: string) => {
    localStorage.setItem('lang', value);
    // Reload trang để áp dụng ngôn ngữ mới
    window.location.reload();
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings, checked: boolean) => {
    updateNotificationSetting(key, checked);
  };

  return (
    <div className="settings-container">
      <Title level={2} className="settings-title">Settings</Title>
      
      <Form layout="vertical" onFinish={handleSaveSettings} className="settings-form">
        {/* Top Row - Language and Security Settings */}
        <Row gutter={[24, 24]} className="settings-row">
          {/* Language Settings Column */}
          <Col xs={24} md={12}>
            <Card title={<><GlobalOutlined /> Language Settings</>} className="settings-card">
              <Form.Item
                label={currentLang === 'vi' ? 'Ngôn ngữ' : 'Language'}
                name="language"
                initialValue={currentLang}
              >
                <Select onChange={handleLanguageChange} className="language-select">
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>
            </Card>
          </Col>

          {/* Security Settings Column */}
          <Col xs={24} md={12}>
            <Card title={<><SecurityScanOutlined /> Security Settings</>} className="settings-card">
              <Space direction="vertical" className="settings-space-vertical security-settings">
                <Button 
                  type="default" 
                  block 
                  onClick={showChangePasswordModal}
                  className="settings-security-button security-button"
                >
                  {currentLang === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
                </Button>
                
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Middle Row - Notification Settings */}
        <Row className="settings-row">
          <Col span={24}>
            <Card title={<><BellOutlined /> Notification Settings</>} className="settings-card">
              <Row gutter={[24, 16]} justify="center" align="middle" className="notification-grid">
                <Col xs={24} md={8} className="notification-item">
                  <Form.Item
                    label={currentLang === 'vi' ? 'Thông báo email' : 'Email notifications'}
                    className="notification-switch"
                  >
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8} className="notification-item">
                  <Form.Item
                    label={currentLang === 'vi' ? 'Thông báo push' : 'Push notifications'}
                    className="notification-switch"
                  >
                    <Switch 
                      checked={notificationSettings.pushNotifications}
                      onChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                    />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={8} className="notification-item">
                  <Form.Item
                    label={currentLang === 'vi' ? 'Thông báo sự kiện' : 'Event notifications'}
                    className="notification-switch"
                  >
                    <Switch 
                      checked={notificationSettings.eventNotifications}
                      onChange={(checked) => handleNotificationChange('eventNotifications', checked)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Divider className="settings-divider" />

        {/* Bottom Row - Action Buttons */}
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12} className="settings-col-center">
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              htmlType="submit"
              size="large"
              className="settings-action-button"
            >
              {currentLang === 'vi' ? 'Lưu cài đặt' : 'Save Settings'}
            </Button>
          </Col>
          
          <Col xs={24} md={12} className="settings-col-center">
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              loading={loading}
              size="large"
              className="settings-action-button"
            >
              {currentLang === 'vi' ? 'Đăng xuất' : 'Logout'}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Change Password Modal */}
      <Modal
        title={
          <Space>
            <LockOutlined />
            {currentLang === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
          </Space>
        }
        open={changePasswordModalVisible}
        onCancel={handleCancelChangePassword}
        footer={null}
        width={500}
        className="change-password-modal"
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          className="change-password-form"
        >
          <Form.Item
            name="currentPassword"
            label={currentLang === 'vi' ? 'Mật khẩu hiện tại' : 'Current Password'}
            rules={[
              { 
                required: true, 
                message: currentLang === 'vi' ? 'Vui lòng nhập mật khẩu hiện tại!' : 'Please enter current password!' 
              }
            ]}
          >
            <Password 
              prefix={<LockOutlined />}
              placeholder={currentLang === 'vi' ? 'Nhập mật khẩu hiện tại' : 'Enter current password'}
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={currentLang === 'vi' ? 'Mật khẩu mới' : 'New Password'}
            rules={[
              { 
                required: true, 
                message: currentLang === 'vi' ? 'Vui lòng nhập mật khẩu mới!' : 'Please enter new password!' 
              },
              { 
                min: 6, 
                message: currentLang === 'vi' ? 'Mật khẩu phải có ít nhất 6 ký tự!' : 'Password must be at least 6 characters!' 
              }
            ]}
          >
            <Password 
              prefix={<LockOutlined />}
              placeholder={currentLang === 'vi' ? 'Nhập mật khẩu mới' : 'Enter new password'}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={currentLang === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}
            dependencies={['newPassword']}
            rules={[
              { 
                required: true, 
                message: currentLang === 'vi' ? 'Vui lòng xác nhận mật khẩu mới!' : 'Please confirm new password!' 
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(currentLang === 'vi' ? 'Mật khẩu xác nhận không khớp!' : 'Password confirmation does not match!')
                  );
                },
              }),
            ]}
          >
            <Password 
              prefix={<LockOutlined />}
              placeholder={currentLang === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm new password'}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancelChangePassword}>
                {currentLang === 'vi' ? 'Hủy' : 'Cancel'}
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={changePasswordLoading}
              >
                {currentLang === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Settings; 