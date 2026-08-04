import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { useSessionStore } from '@/hooks/useSessionStore';

const BASE_URL = process.env.APP_ENV === 'staging'
  ? process.env.EXPO_PUBLIC_API_URL_STAGING
  : process.env.EXPO_PUBLIC_API_URL;

let isRedirecting = false;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useSessionStore.getState().token
      || await SecureStore.getItemAsync('token');

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
  async (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;

      try {
        await SecureStore.deleteItemAsync('token');

        useSessionStore.getState().logout();

        router.replace('/(auth)/login');
      } finally {
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }

      return Promise.reject(
        new Error('Your session has expired. Please sign in again.')
      );
    }

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