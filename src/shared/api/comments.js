import { axiosGestion } from './api';

export const getMyComments = (params = {}) =>
  axiosGestion.get('/comments/mine', { params });

export const getCommentsByRestaurant = (restaurantId) =>
  axiosGestion.get(`/comments/restaurant/${restaurantId}`);

export const createComment = (payload) =>
  axiosGestion.post('/comments', payload);

export const updateComment = (id, payload) =>
  axiosGestion.put(`/comments/${id}`, payload);

export const deactivateComment = (id) =>
  axiosGestion.put(`/comments/deactivate/${id}`);