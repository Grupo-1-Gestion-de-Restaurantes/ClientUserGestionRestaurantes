import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 50_000, suffix: '+', label: 'Clientes felices' },
  { value: 120_000, suffix: '/mes', label: 'Pedidos servidos' },
  { value: 250, suffix: '+', label: 'Restaurantes aliados' },
  { value: 12, suffix: '', label: 'Ciudades' },
];

const formatNumber = (n) => new Intl.NumberFormat('es').format(Math.round(n));

export const StatsSection = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const counters = sectionRef.current?.querySelectorAll('[data-stat]') ?? [];
      counters.forEach((el) => {
        const target = Number(el.dataset.stat);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = formatNumber(obj.val); },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reset',
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden border-y border-stroke-soft"
    >
      <div className="absolute inset-0 bg-grid-red opacity-50 pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-radial-primary opacity-30 mask-radial-fade pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto text-center">
        <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
          Números que orbitan
        </p>
        <h2 className="font-bangers text-4xl md:text-6xl text-on-base tracking-wider mb-14">
          La estación <span className="text-primary">no para</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-surface-2 border-[3px] border-stroke-strong rounded-xl shadow-brutal p-5 md:p-6 flex flex-col items-center hover:bg-surface-3 transition-colors"
            >
              <p className="font-bangers text-4xl sm:text-5xl md:text-5xl text-secondary leading-none flex flex-wrap justify-center items-baseline gap-1">
                <span data-stat={s.value}>0</span>
                <span className="text-2xl sm:text-3xl opacity-90">{s.suffix}</span>
              </p>
              <p className="mt-3 text-on-base text-xs md:text-sm font-bold tracking-wide uppercase text-center">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
