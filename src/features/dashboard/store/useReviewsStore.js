import { create } from 'zustand';
import * as commentsApi from '../../../shared/api/comments';

function extractList(data) {
  if (!data) return [];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.comments)) return data.comments;
  if (Array.isArray(data)) return data;
  return [];
}

export const useReviewsStore = create((set) => ({
  myComments: [],
  byRestaurant: {},
  loading: false,
  submitting: false,
  error: null,

  fetchMyComments: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await commentsApi.getMyComments();
      set({ myComments: extractList(data), loading: false });
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudieron cargar tus reseñas';
      set({ error: message, loading: false });
    }
  },

  fetchRestaurantComments: async (restaurantId) => {
    try {
      const { data } = await commentsApi.getCommentsByRestaurant(restaurantId);
      const list = extractList(data);
      set((state) => ({
        byRestaurant: { ...state.byRestaurant, [restaurantId]: list },
      }));
      return list;
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudieron cargar las reseñas';
      set({ error: message });
      return [];
    }
  },

  submitReview: async ({ restaurantId, dishId, review, comment }) => {
    try {
      set({ submitting: true, error: null });
      const payload = { review, comment };
      if (restaurantId) payload.restaurantId = restaurantId;
      if (dishId) payload.dishId = dishId;
      const { data } = await commentsApi.createComment(payload);
      const created = data?.data || data?.comment || data;
      set((state) => ({
        submitting: false,
        myComments: [created, ...state.myComments.filter((c) => (c._id || c.id) !== (created._id || created.id))],
      }));
      return { success: true, data: created };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo enviar la reseña';
      set({ error: message, submitting: false });
      return { success: false, error: message };
    }
  },

  removeReview: async (id) => {
    try {
      await commentsApi.deactivateComment(id);
      set((state) => {
        const updatedMyComments = state.myComments.filter((c) => (c._id || c.id) !== id);
        const updatedByRestaurant = { ...state.byRestaurant };
        for (const rId in updatedByRestaurant) {
          updatedByRestaurant[rId] = updatedByRestaurant[rId].filter((c) => (c._id || c.id) !== id);
        }
        return {
          myComments: updatedMyComments,
          byRestaurant: updatedByRestaurant,
        };
      });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo eliminar la reseña';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));