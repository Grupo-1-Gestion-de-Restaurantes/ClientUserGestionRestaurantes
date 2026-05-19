import { useEffect, useState } from 'react';
import { Check, Ticket, Loader2 } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { usePromotionsStore } from '../store/usePromotionsStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';

export const PromotionsPage = () => {
  const setPromoCode = useOrderStore((s) => s.setPromoCode);
  const setPromotionId = useOrderStore((s) => s.setPromotionId);
  const setActivePromotion = useOrderStore((s) => s.setActivePromotion);
  const currentPromoId = useOrderStore((s) => s.promotionId);
  
  const { promotions, loading, fetchPromotions } = usePromotionsStore();
  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const [appliedId, setAppliedId] = useState(null);

  useEffect(() => {
    fetchPromotions({ 
      restaurant: selectedRestaurantId,
      scope: 'PEDIDOS'
    });
  }, [fetchPromotions, selectedRestaurantId]);

  const handleApply = (promo) => {
    const id = promo._id || promo.id;
    // Guardamos el título para mostrarlo, el ID para el backend y el objeto para el cálculo local
    setPromoCode(promo.title);
    setPromotionId(id);
    setActivePromotion(promo);
    setAppliedId(id);
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

      {loading && !promotions.length ? (
        <div className="flex justify-center py-20">
          <Loader2 size={48} className="animate-spin text-primary" />
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-surface-2 border-[3px] border-dashed border-stroke-soft rounded-3xl p-10 text-center">
          <Ticket size={48} className="mx-auto text-on-base-faint mb-4" />
          <p className="font-bangers tracking-widest text-on-base-muted text-xl">No hay promociones disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.map((promo) => {
            const id = promo._id || promo.id;
            const isApplied = appliedId === id;
            const isActive = currentPromoId === id;
            return (
              <article
                key={id}
                className="rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-5 flex flex-col gap-4 shadow-brutal-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-brutal-sm border-[3px] border-stroke-strong">
                    <Ticket size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-on-base font-bangers tracking-wide text-xl truncate">
                      {promo.title}
                    </div>
                    <div className="text-xs text-on-base-muted line-clamp-2">{promo.description}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t-[3px] border-stroke-strong">
                  <div className="text-xs font-black tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1">
                    {promo.discountPercentage}% OFF
                  </div>
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
      )}
    </div>
  );
};
