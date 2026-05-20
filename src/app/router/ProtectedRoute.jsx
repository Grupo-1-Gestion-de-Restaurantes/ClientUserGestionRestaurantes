import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { Spinner } from '../../shared/components/layout/Spinner';

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth = useAuthStore((s) => s.isLoadingAuth);

  if (isLoadingAuth) return <Spinner label="Cargando sesión…" />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return children;
};
