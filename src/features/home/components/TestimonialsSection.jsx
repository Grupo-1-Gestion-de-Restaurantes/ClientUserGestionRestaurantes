import { useRef } from 'react';
import { Quote } from 'lucide-react';
import star from '../../../assets/img/star.svg';
import { useParallax2D } from '../../../shared/hooks/useParallax2D';

const TESTIMONIALS = [
  {
    name: 'Andrea Solís',
    role: 'Cliente recurrente',
    quote: 'Mi pedido llegó antes de que terminara mi serie. La app es adictiva, casi tanto como la pizza.',
    accent: 'red',
    rotate: '-rotate-2',
  },
  {
    name: 'Diego Méndez',
    role: 'Foodie certificado',
    quote: 'Encontré tres restaurantes nuevos en una semana. Mi cartera llora, mi estómago aplaude.',
    accent: 'yellow',
    rotate: 'rotate-1',
  },
  {
    name: 'Lucía Ortega',
    role: 'Madre con prisa',
    quote: 'Cuatro hijos, cero tiempo. Express es prácticamente parte de la familia ahora.',
    accent: 'white',
    rotate: '-rotate-1',
  },
];

const accentClasses = {
  red: { border: 'border-primary', icon: 'text-primary', tag: 'bg-primary text-on-primary' },
  yellow: { border: 'border-secondary', icon: 'text-secondary', tag: 'bg-secondary text-on-secondary' },
  white: { border: 'border-on-base', icon: 'text-on-base', tag: 'bg-on-base text-surface-1' },
};

export const TestimonialsSection = () => {
  const ref = useRef(null);

  useParallax2D(ref, [
    { selector: '.testi-card-0', yPercent: -10 },
    { selector: '.testi-card-1', yPercent: 12 },
    { selector: '.testi-card-2', yPercent: -8 },
    { selector: '.testi-star', yPercent: 40 },
  ]);

  return (
    <section
      ref={ref}
      className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />
      <img src={star} alt="" aria-hidden className="testi-star absolute top-[8%] right-[10%] w-7 h-7 opacity-60 animate-twinkle pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
            Lo que dicen
          </p>
          <h2 className="font-bangers text-5xl md:text-7xl text-on-base tracking-wider">
            Voces de la <span className="text-primary">órbita</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {TESTIMONIALS.map((t, i) => {
            const a = accentClasses[t.accent];
            return (
              <article
                key={t.name}
                className={`testi-card-${i} relative bg-surface-2 ${t.rotate} hover:rotate-0 transition-all duration-300 border-[3px] border-stroke-strong ${a.border} shadow-brutal rounded-xl p-7 flex flex-col gap-4`}
              >
                <Quote className={`${a.icon}`} size={28} strokeWidth={2.5} />
                <p className="text-on-base text-base md:text-lg leading-relaxed font-medium">
                  "{t.quote}"
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-stroke-soft">
                  <div>
                    <p className="font-bangers text-lg text-on-base tracking-wide">{t.name}</p>
                    <p className="text-on-base-muted text-xs uppercase tracking-widest font-bold">{t.role}</p>
                  </div>
                  <span className={`${a.tag} text-[10px] font-bangers tracking-widest px-2 py-1 rounded border-2 border-stroke-strong`}>
                    ★★★★★
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
