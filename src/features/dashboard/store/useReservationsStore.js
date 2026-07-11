import { create } from 'zustand';
import { reservationsApi } from '../../../shared/api/reservations';
import { useAuthStore } from '../../auth/store/useAuthStore';

export const useReservationsStore = create((set, get) => ({
  reservations: [],
  loading: false,
  error: null,

  fetchMyReservations: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ loading: true, error: null });
    const res = await reservationsApi.getMyReservations(token);
    
    if (res.success) {
      set({ reservations: res.data || res.reservations || [], loading: false });
    } else {
      set({ error: res.message, loading: false });
    }
  },

  createReservation: async (data) => {
    const token = useAuthStore.getState().token;
    if (!token) return { success: false, message: 'No session' };

    set({ loading: true, error: null });
    const res = await reservationsApi.create(data, token);
    
    if (res.success) {
      set({ loading: false });
      get().fetchMyReservations();
      return res;
    }
    const errorMessage = res.error || res.message || (Array.isArray(res.errors) && res.errors[0]?.message) || 'Error al crear reserva';
    set({ error: errorMessage, loading: false });
    return { ...res, message: errorMessage, error: errorMessage };
  }
}));
