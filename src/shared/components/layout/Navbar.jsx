import { useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, User } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LogoAnimation } from './LogoAnimation';
import { useSoundStore } from '../../../features/home/store/useSoundStore';
import { useAuthStore } from '../../../features/auth/store/useAuthStore';

gsap.registerPlugin(ScrollTrigger);

/**
 * Navbar — Layout compartido para Home y Partners.
 * Fondo translúcido sobre surface-1 que se oscurece al scrollear (sin saltos a rojo).
 */
export const Navbar = () => {
  const navRef = useRef(null);
  const isPlaying = useSoundStore((s) => s.isPlaying);
  const toggle = useSoundStore((s) => s.toggle);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  useGSAP(
    () => {
      gsap.to('.logo-letter', { opacity: 1, duration: 0.3 });
      gsap.to('.sub-logo', { opacity: 1, duration: 0.2 });

      // Scroll: aumenta opacidad de fondo + borde sutil
      gsap.fromTo(
        navRef.current,
        { backgroundColor: 'rgba(17,19,23,0)', borderBottomColor: 'rgba(0,0,0,0)' },
        {
          backgroundColor: 'rgba(17,19,23,0.85)',
          borderBottomColor: 'rgba(255,255,255,0.08)',
          duration: 0.1,
          scrollTrigger: { trigger: document.body, start: 'top top', scrub: true },
        },
      );
    },
    { scope: navRef },
  );

  const linkBase =
    'cursor-pointer hover:text-secondary transition-colors text-sm md:text-base font-bold tracking-wide';

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 text-on-base pointer-events-none border-b-[1px] border-transparent backdrop-blur-sm"
    >
      {/* Left links */}
      <div className="flex gap-6 md:gap-8 pointer-events-auto items-center">
        {isHome ? (
          <>
            <a href="#how" className={linkBase}>Cómo funciona</a>
            <a href="#about" className={`${linkBase} hidden md:inline`}>Nosotros</a>
            <a href="#features" className={`${linkBase} hidden md:inline`}>Funcionalidades</a>
          </>
        ) : (
          <Link to="/" className={linkBase}>← Volver al inicio</Link>
        )}
      </div>

      {/* Center logo */}
      <Link to="/" className="pointer-events-auto">
        <LogoAnimation />
      </Link>

      {/* Right actions */}
      <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">
        {/* Partners CTA (con badge "Nuevo") */}
        <NavLink
          to="/partners"
          className={({ isActive }) =>
            `relative hidden sm:inline-flex items-center gap-2 font-bangers text-base md:text-lg uppercase tracking-wide px-4 py-1.5 rounded-lg border-[3px] border-stroke-strong shadow-brutal-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95 ${
              isActive ? 'bg-secondary text-on-secondary' : 'bg-surface-2 text-on-base'
            }`
          }
        >
          Para Restaurantes
          <span className="absolute -top-2 -right-2 bg-secondary text-on-secondary text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-stroke-strong leading-none">
            NUEVO
          </span>
        </NavLink>

        {/* Login / Dashboard CTA según sesión */}
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-2 bg-secondary text-on-secondary px-4 md:px-5 py-1.5 rounded-lg border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95 transition-all uppercase tracking-wide font-bangers text-base md:text-lg"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt=""
                className="h-6 w-6 rounded-full object-cover border-2 border-stroke-strong"
              />
            ) : (
              <User size={16} />
            )}
            Mi panel
          </Link>
        ) : (
          <Link
            to="/auth"
            className="bg-on-base text-surface-1 px-4 md:px-5 py-1.5 rounded-lg border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95 transition-all uppercase tracking-wide font-bangers text-base md:text-lg"
          >
            Acceder
          </Link>
        )}
      </div>
    </nav>
  );
};
