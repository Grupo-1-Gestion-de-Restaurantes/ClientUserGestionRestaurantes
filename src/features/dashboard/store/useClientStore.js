import { create } from 'zustand';
import * as clientsApi from '../../../shared/api/clients';

export const useClientStore = create((set) => ({
  info: null,
  loading: false,
  error: null,

  fetchMyInfo: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await clientsApi.getMyInfo();
      set({ info: data?.data || data?.client || data, loading: false });
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo cargar tu perfil';
      set({ error: message, loading: false });
    }
  },

  updateMyInfo: async (payload) => {
    try {
      set({ loading: true, error: null });
      const { data } = await clientsApi.updateClient(payload);
      set({ info: data?.data || data?.client || data, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo actualizar el perfil';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  addAddress: async (address) => {
    try {
      set({ loading: true, error: null });
      const { data } = await clientsApi.addAddress(address);
      set({ info: data?.data || data?.client || data, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo agregar la dirección';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updatePhone: async (phone) => {
    try {
      set({ loading: true, error: null });
      const { data } = await clientsApi.updateClientPhone(phone);
      const updatedClient = data?.data || data?.client || data;
      set({ info: updatedClient, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo actualizar el teléfono';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));
