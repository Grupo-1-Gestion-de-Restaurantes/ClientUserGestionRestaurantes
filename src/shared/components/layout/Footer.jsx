import { useRef } from 'react';
import { Link } from 'react-router-dom';
import star from '../../../assets/img/star.svg';
import { useParallax2D } from '../../hooks/useParallax2D';

/**
 * Footer — Layout compartido. Fondo oscuro dominante con franja diagonal roja
 * superior delgada (clip-path) para conservar el énfasis sin saturar.
 */
export const Footer = () => {
  const ref = useRef(null);

  useParallax2D(ref, [
    { selector: '.footer-star-a', yPercent: -40 },
    { selector: '.footer-star-b', yPercent: 30 },
  ]);

  return (
    <footer ref={ref} className="relative w-full bg-surface-1 overflow-hidden">
      {/* Franja diagonal roja superior */}
      <div className="absolute inset-x-0 top-0 h-3 bg-primary clip-diagonal-bottom" aria-hidden />

      <div className="relative max-w-6xl mx-auto px-8 md:px-20 pt-20 pb-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bangers text-3xl md:text-4xl text-on-base tracking-wider">
            EXPRESS
          </h3>
          <p className="text-on-base-muted text-sm leading-relaxed max-w-xs">
            La estación espacial de la gestión de restaurantes.
            Pedidos, mesas y reportes en un solo lugar.
          </p>
          <p className="text-secondary text-xs font-bold tracking-widest uppercase mt-2">
            Estación Espacial · 2026
          </p>
        </div>

        {/* Navegación */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bangers text-lg text-secondary tracking-wide mb-2">Explora</h4>
          <a href="#hero" className="text-on-base-muted hover:text-on-base transition-colors text-sm">Inicio</a>
          <a href="#how" className="text-on-base-muted hover:text-on-base transition-colors text-sm">Cómo funciona</a>
          <a href="#about" className="text-on-base-muted hover:text-on-base transition-colors text-sm">Quiénes somos</a>
          <a href="#features" className="text-on-base-muted hover:text-on-base transition-colors text-sm">Funcionalidades</a>
          <a href="#faq" className="text-on-base-muted hover:text-on-base transition-colors text-sm">FAQ</a>
        </div>

        {/* CTA + contacto */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bangers text-lg text-secondary tracking-wide mb-2">¿Tienes un restaurante?</h4>
          <p className="text-on-base-muted text-sm">Únete a la red de aliados Express.</p>
          <Link
            to="/partners"
            className="self-start mt-2 inline-flex items-center gap-2 bg-secondary text-on-secondary font-bangers text-base tracking-wide uppercase px-5 py-2 rounded-lg border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
          >
            Registra tu restaurante →
          </Link>
          <a
            href="mailto:contacto@express.space"
            className="text-on-base-muted hover:text-on-base transition-colors text-sm mt-3"
          >
            contacto@express.space
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-stroke-soft py-6 px-8 md:px-20 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <p className="text-on-base-faint">
          © {new Date().getFullYear()} Express Space Station. Todos los derechos reservados.
        </p>
        <div className="flex gap-5 text-on-base-faint">
          <a href="#" className="hover:text-on-base transition-colors">Privacidad</a>
          <a href="#" className="hover:text-on-base transition-colors">Términos</a>
        </div>
      </div>

      {/* Stars decorativas con parallax */}
      <img src={star} alt="" aria-hidden className="footer-star-a absolute top-10 left-10 w-5 h-5 opacity-50 pointer-events-none animate-twinkle" />
      <img src={star} alt="" aria-hidden className="footer-star-b absolute bottom-16 right-16 w-6 h-6 opacity-40 pointer-events-none animate-float" />
    </footer>
  );
};
