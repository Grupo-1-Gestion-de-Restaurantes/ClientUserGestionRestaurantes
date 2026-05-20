import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const goBack = () => navigate(isAuthenticated ? '/dashboard' : '/');
  const exit = () => {
    logout();
    navigate('/auth');
  };

  return (
    <main className="relative min-h-screen w-full font-sans text-on-base flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-2 border-[3px] border-stroke-strong rounded-3xl p-8 text-center shadow-brutal">
        <h1 className="font-bangers tracking-wider text-7xl text-primary">403</h1>
        <h2 className="font-bangers tracking-wider text-2xl text-secondary mt-1">ACCESO DENEGADO</h2>
        <p className="text-sm text-on-base-muted mt-3">
          Esta sección es exclusiva para clientes. Inicia sesión con una cuenta de cliente o vuelve al inicio.
        </p>

        <div className="flex flex-col gap-3 mt-6">
          <button
            type="button"
            onClick={goBack}
            className="bg-primary text-on-primary font-bangers tracking-widest py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
          >
            VOLVER A SEGURO
          </button>
          <button
            type="button"
            onClick={exit}
            className="bg-surface-3 text-on-base font-bold py-3 rounded-xl border-[3px] border-stroke-strong hover:bg-surface-4 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  );
};
