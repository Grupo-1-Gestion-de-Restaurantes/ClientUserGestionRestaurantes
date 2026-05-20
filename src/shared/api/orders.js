import { axiosGestion } from './api';

export const createOrder = (payload) => axiosGestion.post('/orders/create', payload);

export const getMyOrders = () => axiosGestion.get('/orders/getMyOrders');

export const getOrderById = (id) => axiosGestion.get(`/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  axiosGestion.put(`/orders/${id}/status`, { status });

export const cancelOrder = (id) =>
  axiosGestion.put(`/orders/${id}/status`, { status: 'CANCELADO' });
