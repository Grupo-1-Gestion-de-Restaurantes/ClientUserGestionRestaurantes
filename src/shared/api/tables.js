import { axiosGestion } from './api';

export const tablesApi = {
  getByRestaurant: async (restaurantId) => {
    try {
      const response = await axiosGestion.get(`/tables/restaurant/${restaurantId}`);
      // Log for debug
      console.log('Tables for restaurant:', restaurantId, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      return error.response?.data || { success: false, message: 'Error al obtener mesas' };
    }
  }
};
