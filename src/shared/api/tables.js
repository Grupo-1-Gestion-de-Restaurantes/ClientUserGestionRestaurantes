import axios from 'axios';

const API_URL = import.meta.env.VITE_GESTION_URL;

export const tablesApi = {
  getByRestaurant: async (restaurantId) => {
    try {
      const response = await axios.get(`${API_URL}/tables/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Error al obtener mesas' };
    }
  }
};
