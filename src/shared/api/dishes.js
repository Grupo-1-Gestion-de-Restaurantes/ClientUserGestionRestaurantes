import { axiosGestion } from './api';

export const getDishes = (params = {}) =>
  axiosGestion.get('/dishes/', {
    params: { page: 1, limit: 20, isActive: true, ...params },
  });

export const getDishById = (id) => axiosGestion.get(`/dishes/${id}`);
