import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: '¿Cuánto cuesta unirse?',
    a: 'El onboarding es gratuito. Solo cobramos una comisión transparente sobre las ventas generadas vía Express. Sin cargos mensuales ocultos.',
  },
  {
    q: '¿Cuánto tarda el proceso de alta?',
    a: 'En promedio 48 horas desde que recibimos tu información completa: fotos, menú y datos bancarios.',
  },
  {
    q: '¿Necesito equipo especial?',
    a: 'No. Funcionamos en cualquier dispositivo con navegador: teléfono, tablet o PC. Si quieres, ofrecemos una tablet de cortesía para sucursales con alto volumen.',
  },
  {
    q: '¿Cómo recibo los pagos?',
    a: 'Realizamos depósitos semanales a tu cuenta bancaria con detalle completo de cada pedido. Sin sorpresas.',
  },
  {
    q: '¿Puedo darme de baja en cualquier momento?',
    a: 'Sí. Sin contratos forzados ni cláusulas de permanencia. Quédate porque te conviene, no porque te obliguemos.',
  },
];

export const PartnersFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
            FAQ Partners
          </p>
          <h2 className="font-bangers text-5xl md:text-6xl text-on-base tracking-wider">
            Lo que más nos <span className="text-secondary">preguntan</span>
          </h2>
        </div>

        <ul className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                key={item.q}
                className={`bg-surface-2 border-[3px] border-stroke-strong rounded-xl shadow-brutal-sm overflow-hidden transition-all ${
                  isOpen ? 'border-l-[8px] border-l-primary' : 'hover:bg-surface-3'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-bangers text-lg md:text-xl text-on-base tracking-wide">
                    {item.q}
                  </span>
                  <span className={`flex-shrink-0 w-9 h-9 rounded-full border-[2px] border-stroke-strong flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-primary text-on-primary' : 'bg-surface-1 text-on-base'
                  }`}>
                    {isOpen ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-on-base-muted text-sm md:text-base leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
