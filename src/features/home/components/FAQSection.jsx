import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: '¿Cómo realizo mi primer pedido?',
    a: 'Solo debes crear una cuenta, elegir un restaurante cercano, armar tu combo y confirmar la dirección de entrega. Te avisaremos cuando esté en camino.',
  },
  {
    q: '¿Cuáles son los métodos de pago disponibles?',
    a: 'Aceptamos tarjeta de crédito/débito, transferencia, y pago contra entrega en efectivo en sucursales seleccionadas.',
  },
  {
    q: '¿Cuánto tarda en llegar mi pedido?',
    a: 'El tiempo promedio es entre 25 y 40 minutos, dependiendo del restaurante y de tu zona. Verás un estimado en tiempo real.',
  },
  {
    q: '¿Puedo cancelar un pedido?',
    a: 'Puedes cancelarlo sin costo mientras el restaurante no haya comenzado a prepararlo. Después de eso aplica una política de reembolso parcial.',
  },
  {
    q: '¿Tienen programa de puntos o recompensas?',
    a: 'Sí. Cada pedido suma estrellas Express que puedes canjear por descuentos, combos secretos y envíos gratis.',
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="relative w-full bg-transparent py-24 px-8 md:px-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-faint pointer-events-none" aria-hidden />

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-secondary font-bangers tracking-[0.3em] text-sm md:text-base uppercase mb-3">
            Preguntas frecuentes
          </p>
          <h2 className="font-bangers text-5xl md:text-6xl text-on-base tracking-wider">
            ¿Tienes <span className="text-secondary">dudas</span>?
          </h2>
        </div>

        <ul className="flex flex-col gap-3">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                key={item.q}
                className={`bg-surface-2 border-[3px] border-stroke-strong rounded-xl shadow-brutal-sm overflow-hidden transition-all ${
                  isOpen ? 'border-l-[8px] border-l-secondary' : 'hover:bg-surface-3'
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
                    isOpen ? 'bg-secondary text-on-secondary' : 'bg-surface-1 text-on-base'
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
