import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../api/auth.api';
import '../../css/auth.css';

const { Title, Text } = Typography;

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values);
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate(from, { replace: true });
        notification.success({ message: response.message });
    } catch (error: any) {
      console.log(error);
      notification.error({ message: 'Login failed. Please try again.' });
      console.error('Login error:', error);
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
              Sign in to manage your eSport team
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
                { required: true, message: 'Please input your email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
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
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
