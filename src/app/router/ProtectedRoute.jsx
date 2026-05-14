import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";

export const ProtectedRoute = ({ children }) => {
  // Leemos el estado global de autenticación
  const { isAuth } = useAuthStore();

  // Si no está autenticado, lo enviamos al login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};