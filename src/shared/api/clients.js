import { axiosGestion } from './api';

export const createClient = (payload) => axiosGestion.post('/clients/create', payload);

export const getMyInfo = () => axiosGestion.get('/clients/myInfo');

export const getClientByUserId = (userId) => axiosGestion.get(`/clients/${userId}`);

export const updateClient = (payload) => axiosGestion.put('/clients/update', payload);

export const updateClientPhone = (phone) => axiosGestion.put('/clients/update', { phone });

export const addAddress = (address) =>
  axiosGestion.put('/clients/addAddress', { address });
