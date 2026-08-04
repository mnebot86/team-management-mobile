import api from './axios';

export const getNotifications = async () => {
  const response = await api.get(`/notifications`);

  return response.data.data;
};
