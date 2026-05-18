import axios from 'axios';

const API_URL = import.meta.env.VITE_GESTION_URL;

export const eventsApi = {
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/events`, { params });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al obtener eventos' };
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al obtener detalle del evento' };
    }
  },

  subscribe: async (id, token) => {
    try {
      const response = await axios.patch(`${API_URL}/events/${id}/subscribe`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al suscribirse al evento' };
    }
  }
};
