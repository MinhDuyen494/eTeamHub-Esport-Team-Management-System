// Language management utility
export const LANGUAGES = {
  VI: 'vi',
  EN: 'en'
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// Messages for different languages
export const MESSAGES = {
  // Auth messages
  LOGIN_SUCCESS: {
    [LANGUAGES.VI]: 'Đăng nhập thành công',
    [LANGUAGES.EN]: 'Login successful'
  },
  LOGIN_FAILED: {
    [LANGUAGES.VI]: 'Đăng nhập thất bại',
    [LANGUAGES.EN]: 'Login failed'
  },
  INVALID_CREDENTIALS: {
    [LANGUAGES.VI]: 'Email hoặc mật khẩu không đúng',
    [LANGUAGES.EN]: 'Invalid email or password'
  },
  LOGOUT_SUCCESS: {
    [LANGUAGES.VI]: 'Đăng xuất thành công',
    [LANGUAGES.EN]: 'Logout successful'
  },
  
  // General messages
  SUCCESS: {
    [LANGUAGES.VI]: 'Thành công',
    [LANGUAGES.EN]: 'Success'
  },
  ERROR: {
    [LANGUAGES.VI]: 'Lỗi',
    [LANGUAGES.EN]: 'Error'
  },
  SAVE_SUCCESS: {
    [LANGUAGES.VI]: 'Lưu thành công',
    [LANGUAGES.EN]: 'Saved successfully'
  },
  DELETE_SUCCESS: {
    [LANGUAGES.VI]: 'Xóa thành công',
    [LANGUAGES.EN]: 'Deleted successfully'
  },
  UPDATE_SUCCESS: {
    [LANGUAGES.VI]: 'Cập nhật thành công',
    [LANGUAGES.EN]: 'Updated successfully'
  },
  
  // Validation messages
  REQUIRED_FIELD: {
    [LANGUAGES.VI]: 'Trường này là bắt buộc',
    [LANGUAGES.EN]: 'This field is required'
  },
  INVALID_EMAIL: {
    [LANGUAGES.VI]: 'Email không hợp lệ',
    [LANGUAGES.EN]: 'Invalid email format'
  },
  PASSWORD_TOO_SHORT: {
    [LANGUAGES.VI]: 'Mật khẩu phải có ít nhất 6 ký tự',
    [LANGUAGES.EN]: 'Password must be at least 6 characters'
  },
  
  // Network messages
  NETWORK_ERROR: {
    [LANGUAGES.VI]: 'Lỗi kết nối mạng',
    [LANGUAGES.EN]: 'Network error'
  },
  SERVER_ERROR: {
    [LANGUAGES.VI]: 'Lỗi máy chủ',
    [LANGUAGES.EN]: 'Server error'
  },
  UNAUTHORIZED: {
    [LANGUAGES.VI]: 'Không có quyền truy cập',
    [LANGUAGES.EN]: 'Unauthorized access'
  },
  FORBIDDEN: {
    [LANGUAGES.VI]: 'Truy cập bị từ chối',
    [LANGUAGES.EN]: 'Access forbidden'
  },
  NOT_FOUND: {
    [LANGUAGES.VI]: 'Không tìm thấy dữ liệu',
    [LANGUAGES.EN]: 'Data not found'
  }
} as const;

// Language management functions
export const getCurrentLanguage = (): Language => {
  return (localStorage.getItem('lang') as Language) || LANGUAGES.VI;
};

export const setLanguage = (language: Language): void => {
  localStorage.setItem('lang', language);
};

export const getMessage = (key: keyof typeof MESSAGES): string => {
  const currentLang = getCurrentLanguage();
  return MESSAGES[key][currentLang] || MESSAGES[key][LANGUAGES.VI];
};

// API request helper to include language header
export const getLanguageHeader = () => {
  return {
    'Accept-Language': getCurrentLanguage()
  };
};

// Format API response message
export const formatApiMessage = (response: any): string => {
  const currentLang = getCurrentLanguage();
  
  // If response has language-specific messages
  if (response.message && typeof response.message === 'object') {
    return response.message[currentLang] || response.message[LANGUAGES.VI] || getMessage('ERROR');
  }
  
  // If response has a simple message
  if (response.message && typeof response.message === 'string') {
    return response.message;
  }
  
  // If response has error messages array
  if (response.errors && Array.isArray(response.errors)) {
    return response.errors.join(', ');
  }
  
  // Default fallback
  return getMessage('ERROR');
}; 