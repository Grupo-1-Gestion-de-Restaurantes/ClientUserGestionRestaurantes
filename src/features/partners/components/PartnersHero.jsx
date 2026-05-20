import { useRef } from 'react';
import { Rocket } from 'lucide-react';
import star from '../../../assets/img/star.svg';
import { useParallax2D } from '../../../shared/hooks/useParallax2D';

export const PartnersHero = () => {
  const ref = useRef(null);

  useParallax2D(ref, [
    { selector: '.phero-blob-a', yPercent: -25, scale: 1.1 },
    { selector: '.phero-blob-b', yPercent: 30 },
    { selector: '.phero-star-a', yPercent: -120, rotate: 45 },
    { selector: '.phero-star-b', yPercent: 80, rotate: -30 },
    { selector: '.phero-star-c', yPercent: -60 },
    { selector: '.phero-badge', yPercent: -20 },
  ]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen bg-transparent pt-32 pb-20 px-8 md:px-20 flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />
      <div className="phero-blob-a absolute -top-20 -left-32 w-[600px] h-[600px] bg-radial-primary opacity-60 pointer-events-none" aria-hidden />
      <div className="phero-blob-b absolute -bottom-32 -right-32 w-[520px] h-[520px] bg-radial-secondary opacity-40 pointer-events-none" aria-hidden />
      <img src={star} alt="" aria-hidden className="phero-star-a absolute top-[18%] right-[18%] w-8 h-8 opacity-80 animate-twinkle pointer-events-none" />
      <img src={star} alt="" aria-hidden className="phero-star-b absolute bottom-[20%] left-[12%] w-10 h-10 opacity-70 animate-float pointer-events-none" />
      <img src={star} alt="" aria-hidden className="phero-star-c absolute top-[40%] left-[45%] w-5 h-5 opacity-50 animate-twinkle pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-center w-full">
        {/* Text */}
        <div>
          <p className="inline-flex items-center gap-2 text-secondary font-bangers tracking-[0.3em] text-xs md:text-sm uppercase mb-4 bg-secondary-soft border-2 border-stroke-yellow px-3 py-1 rounded-full">
            <Rocket size={14} strokeWidth={3} /> Programa Partners
          </p>
          <h1 className="font-bangers text-5xl md:text-7xl lg:text-8xl text-on-base leading-none tracking-wider">
            Lleva tu<br/>
            <span className="text-primary">restaurante</span><br/>
            a <span className="text-secondary">la órbita</span>
          </h1>
          <p className="text-on-base-muted text-base md:text-lg leading-relaxed mt-8 max-w-xl">
            Conecta con miles de clientes hambrientos. Sin costos ocultos, soporte humano, dashboard
            potente y onboarding gratuito. Lo único que tienes que hacer es cocinar.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#partners-form"
              className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-bangers text-lg md:text-xl tracking-wide uppercase px-6 py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
            >
              Empezar registro
            </a>
            <a
              href="#partners-benefits"
              className="inline-flex items-center gap-2 bg-surface-2 text-on-base font-bangers text-lg md:text-xl tracking-wide uppercase px-6 py-3 rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:bg-surface-3 transition-all"
            >
              Ver beneficios
            </a>
          </div>
        </div>

        {/* Visual: stacked card */}
        <div className="phero-badge relative aspect-[4/5] max-w-sm mx-auto md:mx-0 w-full">
          <div className="absolute inset-0 bg-secondary rounded-3xl border-[3px] border-stroke-strong shadow-brutal rotate-[-5deg]" aria-hidden />
          <div className="relative h-full bg-primary text-on-primary rounded-3xl border-[3px] border-stroke-strong shadow-brutal rotate-[3deg] p-8 flex flex-col justify-between">
            <div>
              <p className="font-bangers text-xs tracking-[0.3em] uppercase opacity-90">Partner Card</p>
              <h3 className="font-bangers text-5xl md:text-6xl mt-2 leading-none">
                EXPRESS<br/><span className="text-secondary">PARTNER</span>
              </h3>
            </div>
            <ul className="space-y-2 text-sm md:text-base font-medium opacity-95">
              <li className="flex items-center gap-2"><span className="text-secondary">★</span> Tarifa fija, sin sorpresas</li>
              <li className="flex items-center gap-2"><span className="text-secondary">★</span> Dashboard en tiempo real</li>
              <li className="flex items-center gap-2"><span className="text-secondary">★</span> Soporte humano 24/7</li>
              <li className="flex items-center gap-2"><span className="text-secondary">★</span> Onboarding gratuito</li>
            </ul>
            <div className="flex justify-between items-end text-xs">
              <span className="font-bangers tracking-widest">N° 0001</span>
              <span className="opacity-80">Válido en órbita</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
