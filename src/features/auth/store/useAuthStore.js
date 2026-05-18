import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../../../shared/api/auth';
import { getMyInfo } from '../../../shared/api/clients';

const emptySession = {
  user: null,
  token: null,
  refreshToken: null,
  expiresAt: null,
  isAuthenticated: false,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...emptySession,
      loading: false,
      error: null,
      isLoadingAuth: true,

      checkAuth: () => {
        const { token } = get();
        set({ isLoadingAuth: false, isAuthenticated: Boolean(token) });
      },

      logout: () => set({ ...emptySession, loading: false, error: null }),

      login: async ({ emailOrUsername, password }) => {
        try {
          set({ loading: true, error: null });
          const { data } = await authApi.login({ emailOrUsername: emailOrUsername, password: password });

          const token = data?.accessToken || data?.token;
          const userDetails = data?.userDetails;
          const userId = userDetails?.id || userDetails?._id;

          set({
            user: userDetails,
            token,
            refreshToken: data?.refreshToken || null,
            expiresAt: data?.expiresAt,
            isAuthenticated: false,
            isLoadingAuth: false,
            loading: true,
            error: null,
          });

          if (!token || !userId) {
            const message = 'No se pudo validar tu sesión. Intenta de nuevo.';
            set({ ...emptySession, loading: false, error: message, isLoadingAuth: false });
            return { success: false, error: message };
          }

          try {
            await getMyInfo();
          } catch (clientErr) {
            const status = clientErr.response?.status;
            const message =
              status === 404
                ? 'No tienes cuenta de cliente registrada'
                : (clientErr.response?.data?.message || 'No se pudo validar tu cuenta de cliente');
            set({ ...emptySession, loading: false, error: message, isLoadingAuth: false });
            return { success: false, error: message };
          }

          set({
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Credenciales inválidas';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      register: async (fields) => {
        try {
          set({ loading: true, error: null });
          const formData = new FormData();
          Object.entries(fields).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') return;
            if (key === 'profilePicture' && value instanceof FileList) {
              if (value[0]) formData.append('profilePicture', value[0]);
              return;
            }
            if (key === 'profilePicture' && value instanceof File) {
              formData.append('profilePicture', value);
              return;
            }
            formData.append(key, value);
          });
          const { data } = await authApi.register(formData);
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message = err.response?.data?.message || 'Error al registrarse';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      requestPasswordReset: async (emailOrUsername) => {
        try {
          set({ loading: true, error: null });
          const { data } = await authApi.forgotPassword(emailOrUsername);
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message =
            err.response?.data?.message || 'No se pudo solicitar el restablecimiento';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      resetPassword: async (email, token, newPassword) => {
        try {
          set({ loading: true, error: null });
          const { data } = await authApi.resetPassword(email, token, newPassword);
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message = err.response?.data?.message || 'No se pudo restablecer la contraseña';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },

      resendVerification: async (email) => {
        try {
          set({ loading: true, error: null });
          const { data } = await authApi.resendVerification(email);
          set({ loading: false });
          return { success: true, data };
        } catch (err) {
          const message =
            err.response?.data?.message || 'No se pudo reenviar el correo de verificación';
          set({ error: message, loading: false });
          return { success: false, error: message };
        }
      },
    }),
    {
      name: 'clientuser-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
