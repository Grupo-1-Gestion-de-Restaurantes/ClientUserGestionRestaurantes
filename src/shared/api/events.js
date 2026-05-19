import { axiosGestion } from './api';

export const eventsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axiosGestion.get('/events', { params });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al obtener eventos' };
    }
  },

  getById: async (id) => {
    try {
      const response = await axiosGestion.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al obtener detalle del evento' };
    }
  },

  subscribe: async (id) => {
    try {
      const response = await axiosGestion.patch(`/events/${id}/subscribe`, {});
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al suscribirse al evento' };
    }
  }
};
