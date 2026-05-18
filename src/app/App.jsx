import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './router/AppRoutes';
import { AppShell } from './layouts/AppShell';
import { useAuthStore } from '../features/auth/store/useAuthStore';
import { useSocket } from '../shared/hooks/useSocket';

const SocketInitializer = () => {
  useSocket();
  return null;
};

export const App = () => {
  useEffect(() => {
    useAuthStore.getState().checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <SocketInitializer />
      <AppShell>
        <AppRoutes />
      </AppShell>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
};
