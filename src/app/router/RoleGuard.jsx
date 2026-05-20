import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export const RoleGuard = ({ children, allowedRole = [] }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const hasAccess = isAuthenticated && allowedRole.includes(user?.role);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};
