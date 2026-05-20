import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import star from '../../../assets/img/star.svg';
import { useParallax2D } from '../../../shared/hooks/useParallax2D';

export const CTAPartners = () => {
  const ref = useRef(null);

  useParallax2D(ref, [
    { selector: '.cta-star-a', yPercent: -80, rotate: 45 },
    { selector: '.cta-star-b', yPercent: 70, rotate: -25 },
    { selector: '.cta-star-c', yPercent: -40 },
    { selector: '.cta-glow', yPercent: -20, scale: 1.2 },
  ]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden"
    >
      {/* Bloque rojo con máscara radial — énfasis sin saturar */}
      <div className="relative max-w-6xl mx-auto bg-primary text-on-primary rounded-3xl border-[4px] border-stroke-strong shadow-brutal overflow-hidden">
        <div className="cta-glow absolute inset-0 bg-radial-secondary opacity-25 mask-radial-fade pointer-events-none" aria-hidden />
        <div className="absolute inset-0 bg-grid-red opacity-50 pointer-events-none" aria-hidden />

        <img src={star} alt="" aria-hidden className="cta-star-a absolute top-8 left-10 w-8 h-8 opacity-80 animate-twinkle pointer-events-none" />
        <img src={star} alt="" aria-hidden className="cta-star-b absolute bottom-12 right-16 w-10 h-10 opacity-70 animate-float pointer-events-none" />
        <img src={star} alt="" aria-hidden className="cta-star-c absolute top-1/2 right-[30%] w-5 h-5 opacity-60 animate-twinkle pointer-events-none" />

        <div className="relative px-8 md:px-16 py-16 md:py-24 flex flex-col items-center text-center gap-6">
          <p className="font-bangers tracking-[0.3em] uppercase text-sm md:text-base text-secondary">
            Para restaurantes
          </p>
          <h2 className="font-bangers text-5xl md:text-7xl lg:text-8xl leading-none tracking-wider">
            ¿TIENES UN<br/>
            <span className="text-secondary">RESTAURANTE</span>?
          </h2>
          <p className="max-w-2xl text-base md:text-lg opacity-95 font-medium">
            Únete a la red de aliados Express. Llegamos a miles de clientes hambrientos cada día
            y queremos llevarles tu cocina. Sin costos ocultos, soporte humano de verdad.
          </p>

          <Link
            to="/partners"
            className="mt-4 inline-flex items-center gap-3 bg-secondary text-on-secondary font-bangers text-xl md:text-2xl tracking-wide uppercase px-7 py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] active:scale-95 transition-all"
          >
            Registra tu restaurante
            <ArrowRight size={22} strokeWidth={3} />
          </Link>

          <p className="text-on-primary/70 text-xs tracking-widest uppercase font-bold mt-2">
            Onboarding gratuito · Soporte 24/7
          </p>
        </div>
      </div>
    </section>
  );
};
