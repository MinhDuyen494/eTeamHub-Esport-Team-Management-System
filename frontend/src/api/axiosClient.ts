import axios from 'axios';
import { getLanguageHeader, formatApiMessage } from '../utils/language';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add language header and token
axiosClient.interceptors.request.use(
  (config) => {
    // Add language header
    const languageHeader = getLanguageHeader();
    config.headers['Accept-Language'] = languageHeader['Accept-Language'];
    // Add token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    config.headers['role'] = user.role;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle language-specific messages
axiosClient.interceptors.response.use(
  (response) => {
    // If response has message, format it according to current language
    if (response.data && response.data.message) {
      response.data.formattedMessage = formatApiMessage(response.data);
    }
    return response;
  },
  (error) => {
    // Handle error responses with language-specific messages
    if (error.response && error.response.data) {
      error.response.data.formattedMessage = formatApiMessage(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
