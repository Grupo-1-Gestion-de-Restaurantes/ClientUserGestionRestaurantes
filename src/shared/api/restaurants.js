import { axiosGestion } from './api';

export const getRestaurants = (params = {}) =>
  axiosGestion.get('/restaurants/get', {
    params: { page: 1, limit: 20, ...params },
  });

export const getRestaurantById = (id) => axiosGestion.get(`/restaurants/${id}`);
