import { useRef } from 'react';
import { TrendingUp, ShieldCheck, HeartHandshake, Zap } from 'lucide-react';
import { useParallax2D } from '../../../shared/hooks/useParallax2D';

const BENEFITS = [
  {
    icon: TrendingUp,
    title: 'Más pedidos, menos esfuerzo',
    desc: 'Aparece frente a miles de clientes activos. Aumenta tu ticket promedio sin abrir nuevas sucursales.',
  },
  {
    icon: ShieldCheck,
    title: 'Cero costos ocultos',
    desc: 'Tarifa transparente, pagos puntuales y reportes claros. Sabrás exactamente cuánto ganas.',
  },
  {
    icon: HeartHandshake,
    title: 'Soporte humano real',
    desc: 'Un equipo dedicado responde por chat, mail o teléfono. Nada de bots dando vueltas.',
  },
  {
    icon: Zap,
    title: 'Onboarding rápido',
    desc: 'Subimos tu menú, fotos y horarios en menos de 48 horas. Empiezas a recibir pedidos casi al instante.',
  },
];

export const PartnersBenefits = () => {
  const ref = useRef(null);

  useParallax2D(ref, [
    { selector: '.pbenefit-card', yPercent: -8 },
  ]);

  return (
    <section
      ref={ref}
      id="partners-benefits"
      className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden border-t border-stroke-soft"
    >
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
            Por qué Express
          </p>
          <h2 className="font-bangers text-5xl md:text-7xl text-on-base tracking-wider">
            Cuatro razones <span className="text-primary">simples</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="pbenefit-card bg-surface-2 border-[3px] border-stroke-strong rounded-2xl shadow-brutal p-7 flex gap-5 hover:bg-surface-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-secondary text-on-secondary rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm flex items-center justify-center">
                <Icon size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-bangers text-2xl text-on-base tracking-wide">{title}</h3>
                <p className="text-on-base-muted text-sm md:text-base leading-relaxed mt-2">
                  {desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
