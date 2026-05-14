import { useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LogoAnimation } from './LogoAnimation';

// Registramos el plugin una sola vez
gsap.registerPlugin(ScrollTrigger);

export const Navbar = () => {
  const navRef = useRef(null);

  useGSAP(() => {
    // 1. Animación de entrada inicial del logo al cargar la página
    gsap.to(".logo-letter", { opacity: 1, duration: 0.3 });
    gsap.to(".sub-logo", { opacity: 1, duration: 0.2 });

    // 2. Animación del Navbar reaccionando al Scroll
    // Lee la clase '.hero' que ya pusimos en HeroSection.jsx
    gsap.to(navRef.current, {
      background: "#e7000b", // El fondo rojo que pedías
      position: "fixed",
      duration: 0.1,
      paddingLeft: "100px",
      paddingRight: "100px",
      borderBottom: "5px solid black",
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top', // Empieza apenas scrolleamos
        scrub: true,      // Se enlaza suavemente a la rueda del ratón
      }
    });
  }, { scope: navRef });

  return (
    <div 
      ref={navRef} 
      className="z-50 w-full flex items-center justify-between px-10 md:px-20 py-6 font-bold text-black absolute top-0 left-0 transition-colors pointer-events-none"
    >
      <div className="flex gap-10 text-lg pointer-events-auto">
        <p className="cursor-pointer hover:underline">How it works</p>
        <p className="cursor-pointer hover:underline">Locations</p>
      </div>

      <LogoAnimation />

      <div className="flex items-center gap-6 text-lg pointer-events-auto">
        
        {/* === CONEXIÓN CON TU MÓDULO AUTH === */}
        {/* Usamos <a> en lugar de <Link> porque dijiste que Auth es un módulo aparte. 
            Esto forzará una recarga limpia del navegador para desmontar el 3D y cargar tu Dashboard */}
        <a 
          href="/login" 
          className="bg-white text-black px-6 py-1 rounded-lg border-2 border-black shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95 transition-all uppercase tracking-wide"
        >
          Login
        </a>

        <div className="flex items-center gap-2 border-2 border-black bg-white rounded-full px-3 py-1 cursor-pointer">
          <span>Sound on</span>
          <Volume2 size={18} />
        </div>
      </div>
    </div>
  );
};