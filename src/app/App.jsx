import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './router/AppRoutes';
import { AppShell } from './layouts/AppShell';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useSocket } from '../shared/hooks/useSocket';
import { MusicManager } from '../shared/components/layout/MusicManager';

const SocketInitializer = () => {
  useSocket();
  return null;
};

export const App = () => {
  useEffect(() => {
    useAuthStore.getState().checkAuth();

    // Listener de actividad para mantener sesión (opcional, el store ya tiene timer)
    const handleActivity = () => {
      const { isAuthenticated, refreshToken } = useAuthStore.getState();
      if (isAuthenticated && refreshToken) {
        // Podríamos disparar un refresh proactivo aquí si falta poco, 
        // pero el setupRefreshTimer ya lo hace.
      }
    };

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keypress', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, []);

  return (
    <BrowserRouter>
      <SocketInitializer />
      <AppShell>
        <AppRoutes />
      </AppShell>
      <MusicManager />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
};
