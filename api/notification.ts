import api from './axios';
import type { Notification } from '@/hooks/useNotification';
import type { ApiResponse } from './types';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<ApiResponse<Notification[]>>('/notifications');

  return response.data.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');

  return response.data.data.count;
};

export const markNotificationRead = async (notificationId: string): Promise<Notification> => {
  const response = await api.patch<ApiResponse<Notification>>(`/notifications/${notificationId}/read`);

  return response.data.data;
};

export const markAllNotificationsRead = async (): Promise<{ modifiedCount: number }> => {
  const response = await api.patch<ApiResponse<{ modifiedCount: number }>>('/notifications/read-all');

  return response.data.data;
};
