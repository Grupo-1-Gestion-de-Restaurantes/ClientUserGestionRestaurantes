import { useEffect, useMemo, useState } from 'react';
import { Check, Ticket, Loader2, Info, Calendar, X, Plus, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { usePromotionsStore } from '../store/usePromotionsStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useDishesStore } from '../store/useDishesStore';
import { useUIStore } from '../../../shared/store/useUIStore';
import { filterDishesForPromo } from '../utils/promoHelpers';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { DishImage } from '../components/DishImage';

const getPromoRestaurantId = (promo) => {
  if (!promo) return null;
  const raw = promo.restaurant?._id || promo.restaurant?.id || promo.restaurant;
  return raw ? String(raw) : null;
};

export const PromotionsPage = () => {
  const beginPromoOrder = useOrderStore((s) => s.beginPromoOrder);
  const currentPromoId = useOrderStore((s) => s.promotionId);
  const cartItems = useOrderStore((s) => s.cartItems);
  const addPromoItem = useOrderStore((s) => s.addPromoItem);
  const incQty = useOrderStore((s) => s.incQty);
  const decQty = useOrderStore((s) => s.decQty);
  const getTotals = useOrderStore((s) => s.getTotals);

  const { promotions, loading, fetchPromotions } = usePromotionsStore();
  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const setSelectedRestaurant = useRestaurantsStore((s) => s.setSelectedRestaurant);
  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const fetchRestaurants = useRestaurantsStore((s) => s.fetchRestaurants);
  const storeDishes = useDishesStore((s) => s.dishes);
  const dishesLoading = useDishesStore((s) => s.loading);
  const fetchDishes = useDishesStore((s) => s.fetchDishes);
  const setCartCollapsed = useUIStore((s) => s.setCartCollapsed);

  const [promoOrderModal, setPromoOrderModal] = useState(null);

  useEffect(() => {
    fetchPromotions({
      restaurant: selectedRestaurantId,
      scope: 'PEDIDOS',
    });
    fetchRestaurants();
  }, [fetchPromotions, fetchRestaurants, selectedRestaurantId]);

  const promoRestaurantId = promoOrderModal ? getPromoRestaurantId(promoOrderModal) : null;

  const modalDishes = useMemo(() => {
    if (!promoOrderModal || !promoRestaurantId) return [];
    if (String(selectedRestaurantId) !== promoRestaurantId) return [];
    return filterDishesForPromo(promoOrderModal, storeDishes);
  }, [promoOrderModal, promoRestaurantId, selectedRestaurantId, storeDishes]);

  const modalLoading = !!promoOrderModal && (
    dishesLoading || String(selectedRestaurantId) !== promoRestaurantId
  );

  const getPromoRestaurantName = (promo) => {
    if (promo.restaurant?.name) return promo.restaurant.name;
    const rid = getPromoRestaurantId(promo);
    if (rid) {
      const match = restaurants.find((r) => String(r._id || r.id) === rid);
      if (match?.name) return match.name;
    }
    return 'Restaurante';
  };

  const getApplicabilityText = (promo) => {
    if (promo.dishesApplicables && promo.dishesApplicables.length > 0) {
      return `Aplica a ${promo.dishesApplicables.length} plato(s)`;
    }
    return 'Aplica a todo el menú';
  };

  const getExpiryText = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const daysLeft = differenceInDays(end, new Date());
    if (daysLeft < 0) return 'Expirada';
    if (daysLeft === 0) return 'Vence hoy';
    if (daysLeft === 1) return 'Vence mañana';
    if (daysLeft <= 7) return `Vence en ${daysLeft} días`;
    return `Vence el ${format(end, 'dd MMM', { locale: es })}`;
  };

  const handleStartPromoOrder = async (promo) => {
    if (promo.scope === 'EVENTOS') {
      toast.error('Esta promoción es solo para eventos, no aplica a pedidos');
      return;
    }

    const id = promo._id || promo.id;
    const isSamePromo = String(currentPromoId) === String(id);
    const rid = getPromoRestaurantId(promo);

    if (!isSamePromo) {
      beginPromoOrder(promo);
    }

    if (rid) {
      setSelectedRestaurant(rid);
      await fetchDishes({ restaurant: rid, limit: 100 });
    }

    setPromoOrderModal(promo);

    if (!isSamePromo) {
      toast.success('Agrega los platos con descuento a tu carrito');
    }
  };

  const promoCartCount = useMemo(
    () => cartItems.reduce((sum, it) => sum + it.qty, 0),
    [cartItems],
  );
  const promoTotals = useMemo(() => getTotals(), [getTotals, cartItems, promoOrderModal]);

  const handleFinishPromoOrder = () => {
    if (promoCartCount === 0) {
      toast.error('Agrega al menos un plato para continuar');
      return;
    }
    setPromoOrderModal(null);
    setCartCollapsed(false);
    toast.success('Revisa tu carrito para confirmar el pedido con promoción');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs text-on-base-muted tracking-widest uppercase">Cupones</p>
        <h1 className="mt-1 font-bangers tracking-wider text-4xl md:text-5xl text-on-base">
          Promociones <span className="text-secondary">activas</span>
        </h1>
        <p className="mt-2 text-sm text-on-base-muted">
          Los pedidos normales se hacen desde el inicio. Al aplicar una promoción, eliges los platos
          con descuento y los agregas al carrito — 1 pedido, 1 promoción.
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
            const isActive = String(currentPromoId) === String(id);
            const isEventOnly = promo.scope === 'EVENTOS';

            return (
              <article
                key={id}
                className={`rounded-3xl bg-surface-2 border-[3px] p-5 flex flex-col gap-4 shadow-brutal-sm transition-colors ${
                  isActive ? 'border-secondary bg-secondary/5' : 'border-stroke-strong'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-brutal-sm border-[3px] border-stroke-strong">
                    <Ticket size={20} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-on-base font-bangers tracking-wide text-xl truncate">
                      {promo.title}
                    </div>
                    <div className="text-xs text-on-base-muted line-clamp-2">{promo.description}</div>
                    <div className="flex items-center gap-1 text-[10px] text-secondary font-black tracking-widest uppercase mt-1">
                      <Info size={10} />
                      <span>{getApplicabilityText(promo)}</span>
                    </div>
                    <div className="text-[10px] text-on-base-muted mt-1 truncate">
                      {getPromoRestaurantName(promo)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t-[3px] border-stroke-strong">
                  <div className="flex items-center gap-2 flex-wrap">
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
                    disabled={isEventOnly}
                    onClick={() => handleStartPromoOrder(promo)}
                    className={`rounded-2xl px-4 py-2 text-xs font-bangers tracking-widest border-[3px] border-stroke-strong transition-all flex items-center gap-2 shadow-brutal-sm ${
                      isEventOnly
                        ? 'bg-surface-3 text-on-base-muted opacity-60 cursor-not-allowed'
                        : isActive
                          ? 'bg-secondary text-on-secondary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black]'
                          : 'bg-primary text-on-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black]'
                    }`}
                  >
                    {isActive ? <Check size={14} strokeWidth={3} /> : null}
                    {isActive ? 'CONTINUAR PEDIDO' : 'APLICAR'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {promoOrderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm"
            onClick={() => setPromoOrderModal(null)}
          />
          <div className="relative w-full max-w-2xl bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6 max-h-[90vh] flex flex-col overflow-hidden">

            <div className="flex justify-between items-start mb-4 flex-none">
              <div>
                <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase">
                  Pedido con promoción
                </div>
                <h3 className="font-bangers text-2xl md:text-3xl text-on-base">
                  Elige tus platos con <span className="text-secondary">{promoOrderModal.discountPercentage}% OFF</span>
                </h3>
                <p className="text-xs text-on-base-muted mt-1 leading-snug">
                  {promoOrderModal.title} · {getPromoRestaurantName(promoOrderModal)}. Toca{' '}
                  <span className="font-semibold text-on-base">AGREGAR</span> en cada plato que quieras pedir.
                </p>
              </div>
              <button
                onClick={() => setPromoOrderModal(null)}
                className="h-9 w-9 rounded-xl bg-surface-3 border-[2px] border-stroke-strong flex items-center justify-center shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-none mb-3 rounded-2xl bg-secondary/10 border-[3px] border-secondary/40 px-4 py-3 text-[11px] text-on-base leading-snug">
              Aquí solo verás los platos que aplican a esta promoción. El carrito empieza vacío: tú decides qué agregar.
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar min-h-[200px]">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p className="text-sm text-on-base-muted font-semibold">Cargando platos con descuento…</p>
                </div>
              ) : modalDishes.length > 0 ? (
                modalDishes.map((dish) => {
                  const id = dish._id || dish.id;
                  const price = Number(dish.price) || 0;
                  const discountedPrice = price * (1 - promoOrderModal.discountPercentage / 100);
                  const cartItem = cartItems.find((x) => x.dishId === id);
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 bg-surface-3 border-[3px] border-stroke-strong rounded-2xl p-3 shadow-brutal-sm"
                    >
                      <DishImage
                        src={dish.photo}
                        alt={dish.name}
                        className="h-14 w-14 rounded-xl border-[2px] border-stroke-strong shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-on-base truncate">{dish.name}</div>
                        <div className="text-[11px] text-on-base-muted line-clamp-1 mt-0.5">{dish.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bangers text-secondary">Q{discountedPrice.toFixed(2)}</span>
                          <span className="text-[10px] text-on-base-muted line-through font-semibold">Q{price.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        {cartItem ? (
                          <div className="flex items-center gap-1 bg-surface-2 border-[2px] border-stroke-strong rounded-xl p-0.5">
                            <button
                              type="button"
                              onClick={() => decQty(id)}
                              className="h-6 w-6 rounded-lg bg-surface-3 border-[2px] border-stroke-strong flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-black text-on-base">{cartItem.qty}</span>
                            <button
                              type="button"
                              onClick={() => incQty(id)}
                              className="h-6 w-6 rounded-lg bg-primary text-on-primary border-[2px] border-stroke-strong flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const added = addPromoItem({
                                dishId: id,
                                name: dish.name,
                                photo: dish.photo,
                                subtitle: dish.description,
                                price,
                              });
                              if (!added) toast.error('No se pudo agregar el plato');
                            }}
                            className="bg-primary text-on-primary p-2 rounded-xl border-[2px] border-stroke-strong shadow-brutal-sm font-bangers tracking-widest text-[10px] uppercase flex items-center gap-1 active:translate-y-0.5"
                          >
                            <Plus size={12} />
                            <span>AGREGAR</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 px-4">
                  <UtensilsCrossed size={36} className="mx-auto text-on-base-muted mb-3" />
                  <p className="text-sm font-bold text-on-base">No hay platos en el menú</p>
                  <p className="text-xs text-on-base-muted mt-2 leading-relaxed">
                    Este restaurante aún no tiene platos activos para mostrar con esta promoción.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t-2 border-dashed border-stroke-soft flex-none space-y-3">
              {promoCartCount > 0 && (
                <div className="flex items-center justify-between text-sm bg-surface-3 border-[2px] border-stroke-strong rounded-xl px-4 py-2">
                  <span className="text-on-base-muted">
                    {promoCartCount} plato{promoCartCount === 1 ? '' : 's'} en carrito
                  </span>
                  <div className="text-right">
                    <div className="text-[10px] text-on-base-muted">Total con descuento</div>
                    <div className="font-bangers text-lg text-secondary">Q{promoTotals.total.toFixed(2)}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleFinishPromoOrder}
                  disabled={promoCartCount === 0 || modalLoading}
                  className="flex-1 bg-secondary text-on-secondary font-bangers tracking-widest py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  <ShoppingBag size={16} />
                  {promoCartCount > 0 ? 'LISTO — VER CARRITO' : 'AGREGA PLATOS PARA CONTINUAR'}
                </button>
                <button
                  type="button"
                  onClick={() => setPromoOrderModal(null)}
                  className="px-6 bg-surface-3 text-on-base font-bangers tracking-widest py-3 rounded-2xl border-[3px] border-stroke-strong"
                >
                  CERRAR
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
