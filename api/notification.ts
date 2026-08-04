import api from './axios';

export const getNotifications = async () => {
  const response = await api.get(`/notifications`);

  return response.data.data;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread-count');

  return response.data.data.count;
};

export const markNotificationRead = async (notificationId: string) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);

  return response.data.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch('/notifications/read-all');

  return response.data.data;
};
