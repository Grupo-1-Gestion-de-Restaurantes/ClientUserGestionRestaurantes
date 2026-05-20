import { useEffect, useState } from 'react';
import { Check, Ticket, Loader2, Info, Calendar, X, Utensils } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { usePromotionsStore } from '../store/usePromotionsStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { getDishById } from '../../../shared/api/dishes';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

export const PromotionsPage = () => {
  const setPromoCode = useOrderStore((s) => s.setPromoCode);
  const setPromotionId = useOrderStore((s) => s.setPromotionId);
  const setActivePromotion = useOrderStore((s) => s.setActivePromotion);
  const currentPromoId = useOrderStore((s) => s.promotionId);
  const cartItems = useOrderStore((s) => s.cartItems);
  
  const { promotions, loading, fetchPromotions } = usePromotionsStore();
  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const [appliedId, setAppliedId] = useState(null);
  const [dishModal, setDishModal] = useState({ open: false, promo: null, dishes: [], loading: false });

  useEffect(() => {
    fetchPromotions({ 
      restaurant: selectedRestaurantId,
      scope: 'PEDIDOS'
    });
  }, [fetchPromotions, selectedRestaurantId]);

  const handleApply = (promo) => {
    const id = promo._id || promo.id;
    const hasSpecificDishes = promo.dishesApplicables && promo.dishesApplicables.length > 0;

    if (promo.scope === 'EVENTOS') {
      toast.error('Esta promoción es solo para eventos, no aplica a pedidos');
      return;
    }

    if (hasSpecificDishes && cartItems.length > 0) {
      const applicableItems = cartItems.filter(item =>
        promo.dishesApplicables.some(dishId => String(dishId) === String(item.dishId))
      );
      if (applicableItems.length === 0) {
        toast.error('Esta promoción no aplica a los platos en tu carrito');
        return;
      }
    }

    setPromoCode(promo.title);
    setPromotionId(id);
    setActivePromotion(promo);
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 1500);
  };

  const getApplicabilityText = (promo) => {
    if (promo.dishesApplicables && promo.dishesApplicables.length > 0) {
      return `Aplica a ${promo.dishesApplicables.length} plato(s)`;
    }
    return 'Aplica a todo el pedido';
  };

  const getScopeLabel = (scope) => {
    switch (scope) {
      case 'PEDIDOS': return 'Solo pedidos';
      case 'EVENTOS': return 'Solo eventos';
      case 'AMBOS': return 'Pedidos y eventos';
      default: return scope;
    }
  };

  const getExpiryText = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = differenceInDays(end, now);
    if (daysLeft < 0) return 'Expirada';
    if (daysLeft === 0) return 'Vence hoy';
    if (daysLeft === 1) return 'Vence mañana';
    if (daysLeft <= 7) return `Vence en ${daysLeft} días`;
    return `Vence el ${format(end, 'dd MMM', { locale: es })}`;
  };

  const handleShowDishes = async (promo, e) => {
    e.stopPropagation();
    if (!promo.dishesApplicables || promo.dishesApplicables.length === 0) return;
    
    setDishModal({ open: true, promo, dishes: [], loading: true });
    
    try {
      const dishPromises = promo.dishesApplicables.map(id => getDishById(id).catch(() => null));
      const results = await Promise.all(dishPromises);
      const dishNames = results.map((res, i) => ({
        id: promo.dishesApplicables[i],
        name: res?.data?.data?.name || res?.data?.data?.dish?.name || 'Plato desconocido'
      })).filter(d => d.name !== 'Plato desconocido');
      setDishModal({ open: true, promo, dishes: dishNames, loading: false });
    } catch {
      setDishModal({ open: true, promo, dishes: [], loading: false });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Cupones</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Promociones <span className="text-secondary">activas</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Aplica un cupón y se cargará automáticamente al carrito. Primero agrega platos, luego aplica la promoción.
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
                    {promo.dishesApplicables && promo.dishesApplicables.length > 0 && (
                      <button 
                        onClick={(e) => handleShowDishes(promo, e)}
                        className="flex items-center gap-1 text-[10px] text-secondary hover:text-error transition-colors mt-1"
                      >
                        <Info size={10} />
                        <span>{getApplicabilityText(promo)}</span>
                      </button>
                    )}
                  </div>
                </div>

                {promo.scope && promo.scope !== 'AMBOS' && (
                  <div className="text-[10px] bg-surface-3 px-2 py-1 rounded-lg text-on-base-muted">
                    {getScopeLabel(promo.scope)}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t-[3px] border-stroke-strong">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-black tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1">
                      {promo.discountPercentage}% OFF
                    </div>
                    {promo.endDate && (
                      <div className="flex items-center gap-1 text-[10px] text-on-base-muted">
                        <Calendar size={10} />
                        <span>{getExpiryText(promo.endDate)}</span>
                      </div>
                    )}
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

      {dishModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm" onClick={() => setDishModal({ open: false, promo: null, dishes: [], loading: false })} />
          <div className="relative w-full max-w-md bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6">
            {dishModal.loading ? (
              <div className="flex justify-center py-8">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bangers text-2xl text-on-base">Platos aplicables</h3>
                  <button onClick={() => setDishModal({ open: false, promo: null, dishes: [], loading: false })} className="text-on-base-muted hover:text-on-base">
                    <X size={20} />
                  </button>
                </div>
                {dishModal.promo && (
                  <p className="text-sm text-on-base-muted mb-4">
                    <strong>{dishModal.promo.title}</strong> aplica a los siguientes platos:
                  </p>
                )}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {dishModal.dishes.length > 0 ? (
                    dishModal.dishes.map((dish, i) => (
                      <div key={dish.id || i} className="flex items-center gap-2 bg-surface-3 border-[3px] border-stroke-strong rounded-xl px-4 py-2">
                        <Utensils size={14} className="text-secondary" />
                        <span className="text-sm text-on-base">{dish.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-on-base-muted text-center py-4">No se pudieron cargar los platos</p>
                  )}
                </div>
                <button
                  onClick={() => setDishModal({ open: false, promo: null, dishes: [], loading: false })}
                  className="mt-6 w-full bg-secondary text-on-secondary font-bangers tracking-widest py-3 rounded-xl border-[3px] border-stroke-strong"
                >
                  CERRAR
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};