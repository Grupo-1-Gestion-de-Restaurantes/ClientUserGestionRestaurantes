import { create } from 'zustand';
import * as restaurantsApi from '../../../shared/api/restaurants';
import { useOrderStore } from './useOrderStore';

function extractList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.restaurants)) return data.restaurants;
  return [];
}

export const useRestaurantsStore = create((set) => ({
  restaurants: [],
  loading: false,
  error: null,
  pagination: null,
  selectedRestaurantId: null,

  fetchRestaurants: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const { data } = await restaurantsApi.getRestaurants(params);
      const list = extractList(data);
      set((prev) => {
          return {
            restaurants: list,
            pagination: data?.pagination || null,
            loading: false,
          };
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Error cargando restaurantes';
      set({ error: message, loading: false });
    }
  },

  setSelectedRestaurant: (id) => set((prev) => {
     if (prev.selectedRestaurantId !== id) {
         useOrderStore.getState().clearCart();
     }
     return { selectedRestaurantId: id };
  }),

  clearSelectedRestaurant: () => set((prev) => {
    if (prev.selectedRestaurantId !== null) {
      useOrderStore.getState().clearCart();
    }
    return { selectedRestaurantId: null };
  }),
}));
