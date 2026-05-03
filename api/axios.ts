import axios from 'axios';
import { useSessionStore } from '@/hooks/useSessionStore';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useSessionStore.getState().token || await SecureStore.getItemAsync('token');

    if (token) {
      config.headers = config.headers ?? {};

      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';

    if (error.response) {
      const data = error.response.data;

      if (typeof data === 'string') {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }
    } else if (error.request) {
      message = 'No response from server. Please check your connection.';
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
