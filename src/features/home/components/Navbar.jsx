import { useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LogoAnimation } from './LogoAnimation';
import { useSoundStore } from '../store/useSoundStore';

gsap.registerPlugin(ScrollTrigger);

export const Navbar = () => {
  const navRef = useRef(null);
  const isPlaying = useSoundStore((s) => s.isPlaying);
  const toggle = useSoundStore((s) => s.toggle);

  useGSAP(() => {
    // Logo letters + sub-logo appear
    gsap.to(".logo-letter", { opacity: 1, duration: 0.3 });
    gsap.to(".sub-logo", { opacity: 1, duration: 0.2 });

    // Navbar bg transitions on scroll (yellow → red)
    gsap.to(navRef.current, {
      background: "#e7000b",
      duration: 0.1,
      borderBottom: "4px solid black",
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        scrub: true,
      }
    });
  }, { scope: navRef });

  return (
    <nav 
      ref={navRef} 
      className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-20 py-5 font-bold text-black pointer-events-none"
    >
      {/* Left links */}
      <div className="flex gap-8 text-base md:text-lg pointer-events-auto">
        <a href="#how" className="cursor-pointer hover:underline underline-offset-4 transition-all">
          Cómo funciona
        </a>
        <a href="#features" className="cursor-pointer hover:underline underline-offset-4 transition-all">
          Funcionalidades
        </a>
      </div>

      {/* Center logo */}
      <LogoAnimation />

      {/* Right actions */}
      <div className="flex items-center gap-4 text-base md:text-lg pointer-events-auto">
        
        {/* Login link (connects to Auth module) */}
        <a 
          href="/login" 
          className="bg-white text-black px-5 py-1.5 rounded-lg border-[3px] border-black shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95 transition-all uppercase tracking-wide font-bangers text-lg"
        >
          Acceder
        </a>

        {/* Sound toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-2 border-[3px] border-black bg-white rounded-full px-4 py-1.5 cursor-pointer shadow-brutal-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_black] transition-all active:scale-95"
          aria-label={isPlaying ? 'Mute sound' : 'Unmute sound'}
        >
          <span className="text-sm font-bold">{isPlaying ? 'Sonido: On' : 'Sonido: Off'}</span>
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </nav>
  );
};