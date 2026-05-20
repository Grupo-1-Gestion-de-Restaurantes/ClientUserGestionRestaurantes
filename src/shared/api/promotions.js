import { axiosGestion } from './api';

export const getPromotions = async (params = {}) => {
  return axiosGestion.get('/promotions/get', { params });
};
