import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

export const RoleGuard = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();

  // Si el rol del usuario no está en la lista permitida, lo mandamos a unauthorized
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};