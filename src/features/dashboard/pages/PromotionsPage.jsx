import { useState } from 'react';
import { Check, Ticket } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';

const STATIC_PROMOTIONS = [
  { id: 'promo-1', title: 'TRYNEW', desc: '10% off en tu primer pedido', code: 'TRYNEW' },
  { id: 'promo-2', title: 'EXPRESS5', desc: 'Hasta $5 de descuento', code: 'EXPRESS5' },
];

export const PromotionsPage = () => {
  const setPromoCode = useOrderStore((s) => s.setPromoCode);
  const currentPromo = useOrderStore((s) => s.promoCode);
  const [appliedId, setAppliedId] = useState(null);

  const handleApply = (promo) => {
    setPromoCode(promo.code);
    setAppliedId(promo.id);
    setTimeout(() => setAppliedId(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Cupones</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Promociones <span className="text-secondary">activas</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Aplica un cupón y se cargará automáticamente al carrito.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STATIC_PROMOTIONS.map((promo) => {
          const isApplied = appliedId === promo.id;
          const isActive = currentPromo?.toUpperCase() === promo.code.toUpperCase();
          return (
            <article
              key={promo.id}
              className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-5 flex flex-col gap-4 shadow-brutal-sm"
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-brutal-sm border-[3px] border-stroke-strong">
                  <Ticket size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <div className="text-on-base font-bangers tracking-wide text-xl">
                    {promo.title}
                  </div>
                  <div className="text-xs text-on-base-muted">{promo.desc}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t-[3px] border-stroke-strong">
                <code className="text-xs font-black tracking-widest text-on-base bg-surface-3 border-[3px] border-stroke-strong rounded-full px-3 py-1">
                  {promo.code}
                </code>
                <button
                  type="button"
                  onClick={() => handleApply(promo)}
                  className={`rounded-2xl px-4 py-2 text-xs font-bangers tracking-widest border-[3px] border-stroke-strong transition-all flex items-center gap-2 shadow-brutal-sm ${
                    isActive
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary text-on-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black]'
                  }`}
                >
                  {isApplied || isActive ? <Check size={14} strokeWidth={3} /> : null}
                  {isActive ? 'APLICADO' : isApplied ? '¡APLICADO!' : 'APLICAR'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
