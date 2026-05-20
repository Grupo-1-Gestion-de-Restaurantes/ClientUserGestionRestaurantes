import { create } from 'zustand';
import * as ordersApi from '../../../shared/api/orders';

function extractList(data) {
  if (!data) return [];
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export const useOrdersStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchMyOrders: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await ordersApi.getMyOrders();
      set({ orders: extractList(data), loading: false });
    } catch (err) {
      const message = err.response?.data?.message || 'Error cargando pedidos';
      set({ error: message, loading: false });
    }
  },

  cancelOrder: async (id) => {
    try {
      await ordersApi.cancelOrder(id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'No se pudo cancelar',
      };
    }
  },
}));
