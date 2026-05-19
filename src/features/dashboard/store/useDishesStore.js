import { create } from 'zustand';
import * as dishesApi from '../../../shared/api/dishes';

function extractList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.dishes)) return data.dishes;
  return [];
}

/** Deriva categorías a partir de platos usando dishType; función pura para usar con useMemo. */
export function buildCategoriesFromDishes(dishes) {
  const map = new Map();
  dishes.forEach((d) => {
    const key = (d.dishType || 'OTRO').toString();
    if (!map.has(key)) {
      map.set(key, { id: key, name: key.replace(/_/g, ' '), photo: d.photo, count: 1 });
    } else {
      const prev = map.get(key);
      prev.count += 1;
      if (!prev.photo && d.photo) prev.photo = d.photo;
    }
  });
  return Array.from(map.values());
}

export const useDishesStore = create((set, get) => ({
  dishes: [],
  loading: false,
  error: null,
  pagination: null,

  fetchDishes: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const { data } = await dishesApi.getDishes(params);
      set({
        dishes: extractList(data),
        pagination: data?.pagination || null,
        loading: false,
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Error cargando platos';
      set({ error: message, loading: false });
    }
  },

  reset: () => set({ dishes: [], loading: false, error: null, pagination: null }),

  getCategories: () => buildCategoriesFromDishes(get().dishes),
}));
