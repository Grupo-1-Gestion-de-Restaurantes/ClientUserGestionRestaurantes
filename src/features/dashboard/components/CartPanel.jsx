import { useMemo, useState } from 'react';
import {
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  Ticket,
  Wallet,
  X,
} from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useUIStore } from '../../../shared/store/useUIStore';
import { DishImage } from './DishImage';

const ORDER_TYPES = [
  { id: 'DOMICILIO', label: 'Domicilio' },
  { id: 'RECOGER', label: 'Recoger' },
];

const PAYMENT_METHODS = [
  { id: 'TARJETA', label: 'Tarjeta', Icon: CreditCard },
  { id: 'EFECTIVO', label: 'Efectivo', Icon: Wallet },
];

const TicketNotch = () => (
  <div className="relative my-4 flex-none">
    <div className="border-t-2 border-dashed border-stroke-soft" />
    <span className="absolute -top-2 -left-3 h-4 w-4 rounded-full bg-surface-1 border-[3px] border-stroke-strong" />
    <span className="absolute -top-2 -right-3 h-4 w-4 rounded-full bg-surface-1 border-[3px] border-stroke-strong" />
  </div>
);

export const CartPanel = ({ mode = 'desktop', onClose, onContinue }) => {
  const setCartCollapsed = useUIStore((s) => s.setCartCollapsed);

  const orderType = useOrderStore((s) => s.orderType);
  const address = useOrderStore((s) => s.address);
  const promoCode = useOrderStore((s) => s.promoCode);
  const promotionId = useOrderStore((s) => s.promotionId);
  const cartItems = useOrderStore((s) => s.cartItems);
  const paymentMethod = useOrderStore((s) => s.paymentMethod);
  const submitting = useOrderStore((s) => s.submitting);
  const setOrderType = useOrderStore((s) => s.setOrderType);
  const setPromoCode = useOrderStore((s) => s.setPromoCode);
  const setPaymentMethod = useOrderStore((s) => s.setPaymentMethod);
  const incQty = useOrderStore((s) => s.incQty);
  const decQty = useOrderStore((s) => s.decQty);
  const removeItem = useOrderStore((s) => s.removeItem);
  const getTotals = useOrderStore((s) => s.getTotals);

  const activePromotion = useOrderStore((s) => s.activePromotion);

  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const restaurants = useRestaurantsStore((s) => s.restaurants);

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => (r._id || r.id) === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  const totals = useMemo(
    () => getTotals(),
    [getTotals, cartItems, promoCode, promotionId, activePromotion, orderType],
  );
  const [localError, setLocalError] = useState(null);

  const orderNumber = `#ORD-${String(Date.now()).slice(-6)}`;

  const handleContinue = () => {
    if (!cartItems.length) {
      setLocalError('Tu carrito está vacío.');
      return;
    }
    if (!selectedRestaurantId) {
      setLocalError('Selecciona un restaurante.');
      return;
    }
    if (!paymentMethod) {
      setLocalError('Elige un método de pago.');
      return;
    }

    setLocalError(null);
    if (mode === 'drawer') onClose?.();
    onContinue?.();
  };

  const disableContinue =
    submitting || !cartItems.length || !selectedRestaurantId || !paymentMethod;

  return (
    <div id="tour-cart" className="relative h-full flex flex-col overflow-hidden">
      <div className="relative flex-1 flex flex-col rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-5 shadow-brutal-sm overflow-hidden">
        {/* Header Fijo */}
        <div className="flex-none">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase">
                Express ticket
              </div>
              <div className="font-bangers tracking-wider text-2xl text-on-base">
                {orderNumber}
              </div>
              <div className="text-xs text-on-base-muted mt-1 truncate">
                {selectedRestaurant?.name || 'Selecciona un restaurante'}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {mode === 'desktop' && (
                <button
                  type="button"
                  onClick={() => setCartCollapsed(true)}
                  className="h-9 w-9 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              )}
              {mode === 'drawer' && (
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 w-9 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-1">
            {ORDER_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOrderType(t.id)}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-bangers tracking-widest uppercase transition-all ${
                  t.id === orderType
                    ? 'bg-primary text-on-primary shadow-brutal-sm'
                    : 'text-on-base-muted hover:text-on-base'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <TicketNotch />
        </div>

        {/* LISTA DE PLATILLOS - UNICA SECCION SCROLLEABLE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase mb-2">
            Tu pedido
          </div>
          
          <div className="space-y-3">
            {cartItems.length ? (
              cartItems.map((it) => (
                <div
                  key={it.dishId}
                  className="flex items-center gap-3 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-3 py-2"
                >
                  <DishImage
                    src={it.photo}
                    alt={it.name}
                    className="h-10 w-10 rounded-xl border-[3px] border-stroke-strong shrink-0"
                    iconSize={14}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bangers tracking-wide text-on-base truncate">
                      {it.name}
                    </div>
                    <div className="text-[10px] text-on-base-muted">
                      Q{it.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 scale-90">
                    <button
                      type="button"
                      onClick={() => decQty(it.dishId)}
                      className="h-7 w-7 rounded-lg bg-surface-2 border-2 border-stroke-strong flex items-center justify-center"
                    >
                      <Minus size={12} />
                    </button>
                    <div className="w-5 text-center text-xs font-black text-on-base">
                      {it.qty}
                    </div>
                    <button
                      type="button"
                      onClick={() => incQty(it.dishId)}
                      className="h-7 w-7 rounded-lg bg-surface-2 border-2 border-stroke-strong flex items-center justify-center"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-6 text-sm text-on-base-muted text-center italic">
                Carrito vacío
              </div>
            )}
          </div>
        </div>

        {/* FOOTER FIJO */}
        <div className="flex-none bg-surface-2">
          <TicketNotch />
          
          <div className="space-y-1 text-xs font-semibold mb-4">
            <div className="flex items-center justify-between text-on-base-muted">
              <span>Subtotal</span>
              <span>Q{totals.subtotal.toFixed(2)}</span>
            </div>
            {orderType === 'DOMICILIO' && (
              <div className="flex items-center justify-between text-on-base-muted">
                <span>Delivery</span>
                <span>Q{totals.deliveryCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-on-base-muted">
              <span>Descuento</span>
              <span>-Q{totals.discount.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase mb-2">
            Pago
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {PAYMENT_METHODS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaymentMethod(id)}
                className={`flex items-center justify-center gap-2 rounded-xl border-[3px] px-2 py-2 text-[10px] font-bangers tracking-widest uppercase transition-all ${
                  paymentMethod === id
                    ? 'bg-primary text-on-primary border-stroke-strong shadow-brutal-sm'
                    : 'border-stroke-soft bg-surface-3 text-on-base-muted'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between font-bangers tracking-wider text-on-base border-t-2 border-dashed border-stroke-soft pt-3 mb-4">
            <span className="text-xl">Total</span>
            <span className="text-2xl">Q{totals.total.toFixed(2)}</span>
          </div>

          <button
            type="button"
            disabled={disableContinue}
            onClick={handleContinue}
            className="w-full bg-secondary text-on-secondary font-bangers tracking-widest text-lg py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
          >
            {submitting ? '...' : 'CONFIRMAR'}
          </button>
          
          {localError && (
            <div className="mt-2 text-[10px] text-error font-bold text-center animate-pulse">
              {localError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
