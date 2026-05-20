import { create } from 'zustand';
import * as promotionsApi from '../../../shared/api/promotions';

export const usePromotionsStore = create((set) => ({
  promotions: [],
  loading: false,
  error: null,

  fetchPromotions: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const { data } = await promotionsApi.getPromotions(params);
      set({
        promotions: data?.data || data?.promotions || data || [],
        loading: false,
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Error cargando promociones';
      set({ error: message, loading: false });
    }
  },
}));
