import axios from 'axios';

const API_URL = import.meta.env.VITE_GESTION_URL;

export const reservationsApi = {
  create: async (data, token) => {
    try {
      const response = await axios.post(`${API_URL}/reservations/create`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al crear la reserva' };
    }
  },

  getMyReservations: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/my-reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al obtener mis reservas' };
    }
  },

  getById: async (id, token) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al obtener la reserva' };
    }
  }
};
