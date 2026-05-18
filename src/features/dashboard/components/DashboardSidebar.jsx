import { NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar,
  History,
  LayoutGrid,
  LogOut,
  Sparkles,
  Store,
  Tag,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';

const nav = [
  { to: '/dashboard', label: 'Pedido', icon: LayoutGrid },
  { to: '/dashboard/restaurants', label: 'Restaurantes', icon: Store },
  { to: '/dashboard/promotions', label: 'Promos', icon: Tag },
  { to: '/dashboard/reservations', label: 'Reservas', icon: Calendar },
  { to: '/dashboard/events', label: 'Eventos', icon: Sparkles },
];

export const DashboardSidebar = ({ onNavigate, variant = 'sidebar' }) => {
  const isDrawer = variant === 'drawer';
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const name = user?.username || user?.name || 'Cliente';
  const avatar = user?.profilePicture;

  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  return (
    <aside
      id="tour-sidebar"
      className={`sidebar-glass h-full shrink-0 px-3 py-6 flex flex-col gap-6 self-start min-h-screen ${
        isDrawer ? 'w-80' : 'w-24 xl:w-64 sticky top-0'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-2 ${
          isDrawer ? 'justify-start' : 'justify-center xl:justify-start'
        }`}
      >
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center font-bangers text-white text-3xl shadow-lg">
          E
        </div>
        <div className={`${isDrawer ? 'flex' : 'hidden xl:flex'} flex-col leading-tight`}>
          <div className="font-bangers text-on-base text-2xl tracking-wider">EXPRESS</div>
          <div className="text-[10px] text-on-base-muted tracking-widest uppercase">
            Tablero de pedidos
          </div>
        </div>
      </div>

      <div className={`${isDrawer ? 'block' : 'hidden xl:block'} px-1`}>
        <button
          type="button"
          onClick={() => {
            navigate('/dashboard/profile');
            onNavigate?.();
          }}
          className="w-full flex items-center gap-3 rounded-2xl liquid-glass px-3 py-3 text-left hover:shadow-lg transition-all"
        >
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-11 w-11 rounded-2xl object-cover"
            />
          ) : (
            <div className="h-11 w-11 rounded-2xl bg-primary text-white flex items-center justify-center font-bangers text-2xl">
              {String(name).slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-bangers tracking-wide text-on-base text-xl truncate">{name}</div>
            <div className="text-[10px] text-on-base-muted tracking-widest uppercase">
              Editar perfil
            </div>
          </div>
        </button>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <NavLink
            to="/"
            onClick={() => onNavigate?.()}
            className="flex items-center justify-center rounded-2xl liquid-glass px-3 py-2 text-xs font-bangers tracking-widest text-on-base hover:text-primary transition-colors"
          >
            INICIO
          </NavLink>
          <NavLink
            to="/dashboard/history"
            onClick={() => onNavigate?.()}
            className="flex items-center justify-center rounded-2xl liquid-glass px-3 py-2 text-xs font-bangers tracking-widest text-on-base hover:text-primary transition-colors"
          >
            HISTORIAL
          </NavLink>
        </div>
      </div>

      <nav className="flex flex-col gap-2 px-1">
        {nav.map(({ to, label, icon: Icon }) => {
          let id = undefined;
          if (to === '/dashboard/restaurants') id = 'tour-restaurants';
          if (to === '/dashboard/history') id = 'tour-history';

          return (
            <NavLink
              key={to}
              id={id}
              to={to}
              end={to === '/dashboard'}
              onClick={() => onNavigate?.()}
              className={({ isActive }) => {
                const align = isDrawer ? 'justify-start' : 'justify-center xl:justify-start';
                return `group flex items-center ${align} gap-3 rounded-2xl px-3 py-3 transition-all nav-item-glass ${
                  isActive
                    ? 'active text-primary bg-primary/10'
                    : 'text-on-base hover:text-primary hover:bg-surface-3'
                }`;
              }}
            >
              <Icon size={20} />
              <span className={`${isDrawer ? 'inline' : 'hidden xl:inline'} text-sm font-bangers tracking-widest uppercase`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className={`mt-auto flex items-center gap-2 rounded-2xl bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-3 transition-all font-bangers tracking-widest text-sm nav-item-glass ${
          isDrawer ? 'justify-start' : 'justify-center xl:justify-start'
        }`}
      >
        <LogOut size={16} />
        <span className={`${isDrawer ? 'inline' : 'hidden xl:inline'}`}>SALIR</span>
      </button>
    </aside>
  );
};
