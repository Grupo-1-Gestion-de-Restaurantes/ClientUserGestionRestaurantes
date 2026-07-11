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

      checkAuth: async () => {
        const { token, refreshToken } = get();
        if (!token) {
          set({ isLoadingAuth: false, isAuthenticated: false });
          return;
        }

        try {
          set({ isLoadingAuth: true });
          // Validamos el token obteniendo el perfil
          const { data } = await authApi.getProfile();
          set({ 
            user: data?.userDetails || get().user, 
            isAuthenticated: true, 
            isLoadingAuth: false 
          });
          
          // Iniciar refresco automático si tenemos refresh token
          if (refreshToken) {
            get().setupRefreshTimer();
          }
        } catch (err) {
          // Si el perfil falla (ej. DB borrada o token inválido), limpiamos sesión
          console.error('Session validation failed:', err);
          get().logout();
          set({ isLoadingAuth: false });
        }
      },

      setupRefreshTimer: () => {
        const { expiresAt } = get();
        if (!expiresAt) return;

        // Limpiar timer previo
        if (window._authRefreshTimer) clearTimeout(window._authRefreshTimer);

        const expiresDate = new Date(expiresAt);
        const now = new Date();
        // Refrescar 1 minuto antes de que expire
        const delay = expiresDate.getTime() - now.getTime() - 60000;

        if (delay > 0) {
          window._authRefreshTimer = setTimeout(async () => {
            try {
              const { refreshToken } = get();
              if (!refreshToken) return;
              
              const { data } = await authApi.refreshToken(refreshToken);
              set({
                token: data.accessToken,
                refreshToken: data.refreshToken,
                expiresAt: data.expiresAt,
                user: data.userDetails || get().user
              });
              get().setupRefreshTimer(); // Re-programar
            } catch (err) {
              console.error('Auto-refresh failed:', err);
              get().logout();
            }
          }, delay);
        } else {
          // Si ya expiró o está por expirar, intentar refrescar ya
          get().refreshToken();
        }
      },

      refreshToken: async () => {
        const { refreshToken: rToken } = get();
        if (!rToken) return { success: false };
        
        try {
          const { data } = await authApi.refreshToken(rToken);
          set({
            token: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: data.expiresAt,
            user: data.userDetails || get().user,
            isAuthenticated: true
          });
          get().setupRefreshTimer();
          return { success: true };
        } catch (err) {
          get().logout();
          return { success: false };
        }
      },

      logout: () => {
        if (window._authRefreshTimer) clearTimeout(window._authRefreshTimer);
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('clientuser:orderWizardDone:') ||
              key.startsWith('clientuser:onboarding:') ||
              key === 'clientuser:onboardingDone') {
            localStorage.removeItem(key);
          }
        });
        set({ ...emptySession, loading: false, error: null });
      },

      login: async ({ emailOrUsername, password }) => {
        try {
          if (window._authRefreshTimer) clearTimeout(window._authRefreshTimer);
          set({ ...emptySession, loading: true, error: null });
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

          const isClient = userDetails?.role === 'CLIENT_ROLE' || userDetails?.role === 'USER_ROLE';

          if (isClient) {
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
          }

          set({
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return { success: true };
        } catch (err) {
          let message = 'Credenciales inválidas';
          if (!err.response) {
            message = 'No se pudo conectar con el servidor. Verifica tu conexión de red o si el servidor está en ejecución.';
          } else if (err.response.data && (err.response.data.message || err.response.data.detail)) {
            message = err.response.data.message || err.response.data.detail;
          } else if (err.response.status === 401) {
            message = 'Credenciales inválidas';
          } else if (err.response.status === 500) {
            message = 'Error interno del servidor de autenticación';
          }
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

      resetPassword: async (token, newPassword) => {
        try {
          set({ loading: true, error: null });
          const { data } = await authApi.resetPassword(token, newPassword);
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
