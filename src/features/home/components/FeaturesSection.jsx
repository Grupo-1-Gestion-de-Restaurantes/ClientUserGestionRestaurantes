import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import star from '../../../assets/img/star.svg';
import { useParallax2D } from '../../../shared/hooks/useParallax2D';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    title: 'Gestión de Mesas',
    description: 'Organiza tu sala en tiempo real. Asigna, libera y monitorea cada mesa desde cualquier dispositivo.',
  },
  {
    title: 'Toma de Pedidos',
    description: 'Pedidos directos a cocina sin intermediarios. Reduce errores y acelera el servicio.',
  },
  {
    title: 'Reportes en Tiempo Real',
    description: 'Dashboards con ventas, productos top y métricas clave. Decisiones basadas en datos.',
  },
  {
    title: 'Gestión de Menú',
    description: 'Actualiza precios, categorías y disponibilidad al instante. Tu carta siempre al día.',
  },
];

export const FeaturesSection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      '.feature-card',
      { y: 50, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { scope: sectionRef });

  useParallax2D(sectionRef, [
    { selector: '.feat-star-a', yPercent: -50 },
    { selector: '.feat-star-b', yPercent: 60 },
  ]);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-transparent flex flex-col items-center justify-center px-8 md:px-20 py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />

      {/* Floating stars con parallax */}
      <img src={star} alt="" aria-hidden className="feat-star-a absolute top-[8%] right-[12%] w-8 h-8 animate-float pointer-events-none" />
      <img src={star} alt="" aria-hidden className="feat-star-b absolute bottom-[12%] left-[8%] w-6 h-6 animate-twinkle pointer-events-none" />

      <div className="relative max-w-5xl w-full">
        {/* Title */}
        <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase text-center mb-3">
          Lo que ofrecemos
        </p>
        <h2 className="font-bangers text-5xl md:text-7xl lg:text-8xl font-black text-on-base text-stroke tracking-wider text-center mb-4">
          FUNCIONALIDADES <span className="text-secondary">EXPRESS</span>
        </h2>
        <p className="text-center text-on-base-muted text-lg md:text-xl font-medium mb-14">
          Todo lo que tu restaurante necesita, en un solo sistema
        </p>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className="feature-card group bg-surface-2 rounded-xl border-[3px] border-stroke-strong shadow-brutal p-6 flex flex-col gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] hover:bg-surface-3 transition-all cursor-pointer relative"
            >
              {/* Marker SVG decorations */}
              <img
                src="/home/marker.svg"
                alt=""
                aria-hidden
                className="absolute -top-3 -right-3 w-8 h-8 pointer-events-none animate-float"
                style={{ animationDelay: `${i * 0.3}s` }}
              />

              {/* Number badge */}
              <div className="w-10 h-10 bg-secondary text-on-secondary rounded-full border-[2px] border-stroke-strong flex items-center justify-center font-bangers text-xl shadow-brutal-sm">
                {i + 1}
              </div>

              {/* Title & Desc */}
              <h3 className="font-bangers text-xl tracking-wide text-on-base group-hover:text-secondary transition-colors">{feat.title}</h3>
              <p className="text-sm text-on-base-muted leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
