import { create } from 'zustand';
import * as invoicesApi from '../../../shared/api/invoices';

function extractList(data) {
  if (!data) return [];
  if (Array.isArray(data?.invoices)) return data.invoices;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data)) return data;
  return [];
}

export const useInvoicesStore = create((set) => ({
  invoices: [],
  loading: false,
  error: null,
  detail: null,

  fetchMyInvoices: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await invoicesApi.getMyInvoices();
      set({ invoices: extractList(data), loading: false });
    } catch (err) {
      const message = err.response?.data?.message || 'Error cargando facturas';
      set({ error: message, loading: false });
    }
  },

  fetchInvoice: async (id) => {
    try {
      set({ loading: true, error: null });
      const { data } = await invoicesApi.getInvoiceById(id);
      set({ detail: data?.data || data?.invoice || data, loading: false });
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo cargar la factura';
      set({ error: message, loading: false });
    }
  },

  downloadInvoicePdf: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await invoicesApi.downloadInvoicePdf(id);
      set({ loading: false });
      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo descargar la factura';
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  clearDetail: () => set({ detail: null }),
}));
