import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Space, Alert, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { login as loginApi } from '../../api/auth.api';
import { getCurrentLanguage, getMessage } from '../../utils/language';
import '../../css/auth.css';
import { getProfile } from '../../api/users.api';

const { Title, Text } = Typography;

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = React.useContext(AuthContext);
  const currentLang = getCurrentLanguage();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await loginApi(values);
      
      // Check if login was successful
      if (response.access_token && response.user) {
        // Save to localStorage
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token || '');
        
        // Call context login
        const userProfileResponse = await getProfile();
        const user = userProfileResponse.user || userProfileResponse;
        localStorage.setItem('user', JSON.stringify(user));
        console.log(user);
        
        // Show success message from backend first, fallback to default
        const successMessage = response.message || getMessage('LOGIN_SUCCESS');
        notification.success({ message: successMessage });
        
        navigate(from, { replace: true });
      } else {
        // Show error message from backend first, fallback to default
        const errorMessage = response.message || getMessage('LOGIN_FAILED');
        notification.error({ message: errorMessage });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle error response - prioritize backend message
      const errorMessage = error.response?.data?.message || getMessage('LOGIN_FAILED');
      notification.error({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <Card className="loginCard">
          <div className="logoSection">
            <Title level={2} className="title">
              eSport Team Manager
            </Title>
            <Text type="secondary">
              {currentLang === 'vi' ? 'Đăng nhập để quản lý đội eSport' : 'Sign in to manage your eSport team'}
            </Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { 
                  required: true, 
                  message: currentLang === 'vi' ? 'Vui lòng nhập email!' : 'Please input your email!' 
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={currentLang === 'vi' ? 'Email' : 'Email'}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { 
                  required: true, 
                  message: currentLang === 'vi' ? 'Vui lòng nhập mật khẩu!' : 'Please input your password!' 
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={currentLang === 'vi' ? 'Mật khẩu' : 'Password'}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="loginButton"
              >
                {currentLang === 'vi' ? 'Đăng nhập' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
