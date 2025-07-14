import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/users.api';
import { getCurrentLanguage } from '../utils/language';

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  eventNotifications: boolean;
}

interface SettingsContextType {
  // Modal states
  changePasswordModalVisible: boolean;
  setChangePasswordModalVisible: (visible: boolean) => void;
  
  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
  changePasswordLoading: boolean;
  setChangePasswordLoading: (loading: boolean) => void;
  
  // Notification settings
  notificationSettings: NotificationSettings;
  updateNotificationSetting: (key: keyof NotificationSettings, value: boolean) => void;
  
  // Functions
  handleLogout: () => void;
  handleSaveSettings: (values: any) => void;
  showChangePasswordModal: () => void;
  handleChangePassword: (values: any) => Promise<void>;
  handleCancelChangePassword: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    eventNotifications: true,
  });

  const currentLang = getCurrentLanguage();

  // Load notification settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setNotificationSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing notification settings:', error);
      }
    }
  }, []);

  // Update notification setting
  const updateNotificationSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    
    // Save to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
    
    // Show notification
    const settingNames = {
      emailNotifications: currentLang === 'vi' ? 'Thông báo email' : 'Email notifications',
      pushNotifications: currentLang === 'vi' ? 'Thông báo push' : 'Push notifications',
      eventNotifications: currentLang === 'vi' ? 'Thông báo sự kiện' : 'Event notifications',
    };
    
    notification.success({
      message: currentLang === 'vi' ? 'Cập nhật cài đặt' : 'Settings updated',
      description: `${settingNames[key]} ${value ? (currentLang === 'vi' ? 'đã bật' : 'enabled') : (currentLang === 'vi' ? 'đã tắt' : 'disabled')}`,
    });
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
    
    // Update notification settings if provided
    if (values.emailNotifications !== undefined) {
      updateNotificationSetting('emailNotifications', values.emailNotifications);
    }
    if (values.pushNotifications !== undefined) {
      updateNotificationSetting('pushNotifications', values.pushNotifications);
    }
    if (values.eventNotifications !== undefined) {
      updateNotificationSetting('eventNotifications', values.eventNotifications);
    }
    
    notification.success({
      message: currentLang === 'vi' ? 'Đã lưu cài đặt' : 'Settings saved',
    });
  };

  const showChangePasswordModal = () => {
    setChangePasswordModalVisible(true);
  };

  const handleChangePassword = async (values: any) => {
    setChangePasswordLoading(true);
    try {
      const res = await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      console.log('Change password:', res);
      
      notification.success({
        message: currentLang === 'vi' ? 'Đổi mật khẩu thành công' : 'Password changed successfully',
      });
      
      setChangePasswordModalVisible(false);
    } catch (error) {
      console.log('Change password error:', error);
      notification.error({
        message: currentLang === 'vi' ? 'Đổi mật khẩu thất bại' : 'Failed to change password',
      });
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleCancelChangePassword = () => {
    setChangePasswordModalVisible(false);
  };

  const value: SettingsContextType = {
    changePasswordModalVisible,
    setChangePasswordModalVisible,
    loading,
    setLoading,
    changePasswordLoading,
    setChangePasswordLoading,
    notificationSettings,
    updateNotificationSetting,
    handleLogout,
    handleSaveSettings,
    showChangePasswordModal,
    handleChangePassword,
    handleCancelChangePassword,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 