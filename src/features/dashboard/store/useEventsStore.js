import { create } from 'zustand';
import { eventsApi } from '../../../shared/api/events';

export const useEventsStore = create((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (params) => {
    set({ loading: true, error: null });
    const res = await eventsApi.getAll(params);
    
    if (res.success) {
      set({ events: res.data || res.events || [], loading: false });
    } else {
      set({ error: res.message, loading: false });
    }
  },

  subscribeToEvent: async (id) => {
    set({ loading: true, error: null });
    const res = await eventsApi.subscribe(id);
    
    if (res.success) {
      set({ loading: false });
      get().fetchEvents();
      return res;
    } else {
      set({ error: res.message, loading: false });
      return res;
    }
  }
}));
