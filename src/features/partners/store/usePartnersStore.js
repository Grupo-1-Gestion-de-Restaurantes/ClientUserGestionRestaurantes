import { create } from 'zustand';

/**
 * usePartnersStore — Estado UI del flujo de registro de restaurante.
 *  status: 'idle' | 'loading' | 'success' | 'error'
 */
export const usePartnersStore = create((set) => ({
  status: 'idle',
  errorMessage: null,
  leadId: null,

  setLoading: () => set({ status: 'loading', errorMessage: null }),
  setSuccess: (leadId) => set({ status: 'success', leadId, errorMessage: null }),
  setError: (msg) => set({ status: 'error', errorMessage: msg }),
  reset: () => set({ status: 'idle', errorMessage: null, leadId: null }),
}));
