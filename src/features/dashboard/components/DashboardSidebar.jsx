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
  ShoppingBag,
} from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { DashboardHelpFab } from './DashboardHelpFab';
import logo from '../../../assets/img/Express.png';

const nav = [
  { to: '/dashboard', label: 'Comenzar Pedido', icon: ShoppingBag, clearSelection: true },
  { to: '/dashboard/promotions', label: 'Promos', icon: Tag },
  { to: '/dashboard/reservations', label: 'Reservas', icon: Calendar },
  { to: '/dashboard/events', label: 'Eventos', icon: Sparkles },
  { to: '/dashboard/history', label: 'Historial', icon: History },
  { to: '/dashboard/profile', label: 'Mi Perfil', icon: User },
];

export const DashboardSidebar = ({ onNavigate, variant = 'sidebar' }) => {
  const isDrawer = variant === 'drawer';
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const clearSelectedRestaurant = useRestaurantsStore((s) => s.clearSelectedRestaurant);
  const user = useAuthStore((s) => s.user);
  const name = user?.username || user?.name || 'Cliente';
  const avatar = user?.profilePicture;

  const handleLogout = () => {
    logout();
    onNavigate?.();
  };

  const handleNavClick = (item) => {
    if (item.clearSelection) {
      clearSelectedRestaurant();
    }
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
        <div 
          onClick={() => {
            clearSelectedRestaurant();
            navigate('/dashboard');
          }}
          className="h-12 w-12 rounded-2xl bg-brand-dark flex items-center justify-center shadow-lg p-1 cursor-pointer hover:scale-105 transition-transform"
        >
          <img src={logo} alt="Express" className="w-full h-full object-contain" />
        </div>
        <div className={`${isDrawer ? 'flex' : 'hidden xl:flex'} flex-col leading-tight`}>
          <div className="font-bangers text-on-base text-2xl tracking-wider">EXPRESS</div>
          <div className="text-[10px] text-on-base-muted tracking-widest uppercase">
            Sistema de Pedidos
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={() => handleNavClick(item)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all border-[3px] ${
                isActive
                  ? 'bg-secondary text-on-secondary border-stroke-strong shadow-brutal-sm scale-[1.02]'
                  : 'text-on-base hover:bg-surface-2 border-transparent'
              } ${isDrawer ? 'justify-start' : 'justify-center xl:justify-start'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 3 : 2} />
                <span
                  className={`font-bangers tracking-wider text-lg ${
                    isDrawer ? 'block' : 'hidden xl:block'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        {/* Help Fab higher up */}
        <DashboardHelpFab />

        <div
          className={`flex items-center gap-3 p-2 rounded-2xl bg-surface-2 border-[3px] border-stroke-strong shadow-brutal-sm ${
            isDrawer ? 'px-4' : 'xl:px-4'
          }`}
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="h-10 w-10 rounded-xl object-cover border-2 border-stroke-strong shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bangers text-xl border-2 border-stroke-strong shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div
            className={`min-w-0 flex-1 ${isDrawer ? 'block' : 'hidden xl:block'}`}
          >
            <div className="text-sm font-bangers tracking-wide text-on-base truncate">
              {name}
            </div>
            <div className="text-[10px] text-on-base-muted font-black uppercase tracking-widest">
              Cliente
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-xl text-on-base-muted hover:text-error hover:bg-error/10 transition-colors ${
              isDrawer ? 'block' : 'hidden xl:block'
            }`}
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
        
        {/* Icon-only logout for collapsed desktop view */}
        {!isDrawer && (
          <button
            onClick={handleLogout}
            className="xl:hidden flex items-center justify-center h-12 w-12 rounded-2xl bg-surface-2 border-[3px] border-stroke-strong text-on-base-muted hover:text-error transition-all"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};
