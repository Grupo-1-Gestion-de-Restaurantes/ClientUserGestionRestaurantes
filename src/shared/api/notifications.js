import { axiosGestion } from './api';

export const listNotifications = (params = {}) =>
  axiosGestion.get('/notifications/', { params: { page: 1, limit: 10, ...params } });

export const unreadCount = () => axiosGestion.get('/notifications/unread-count');

export const markRead = (id) => axiosGestion.put(`/notifications/${id}/read`);

export const markAllRead = () => axiosGestion.put('/notifications/read-all');

export const removeNotification = (id) => axiosGestion.delete(`/notifications/${id}`);
