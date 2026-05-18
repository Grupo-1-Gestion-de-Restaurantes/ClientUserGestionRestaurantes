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
  { id: 'delivery', label: 'Delivery' },
  { id: 'dine_in', label: 'Dine In' },
  { id: 'takeaway', label: 'Takeaway' },
];

const PAYMENT_METHODS = [
  { id: 'TARJETA', label: 'Tarjeta', Icon: CreditCard },
  { id: 'EFECTIVO', label: 'Efectivo', Icon: Wallet },
];

// El borde "ticket" se logra con dos semicírculos absolutos negativos en los
// lados del divisor + un borde superior punteado: simula la perforación de un
// recibo físico sin recurrir a clip-path complejo.
const TicketNotch = () => (
  <div className="relative my-4">
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

  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const restaurants = useRestaurantsStore((s) => s.restaurants);

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => (r._id || r.id) === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  const totals = useMemo(
    () => getTotals(),
    [getTotals, cartItems, promoCode, orderType],
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
    <div id="tour-cart" className="relative">
      <div className="relative rounded-3xl bg-surface-2 border-[3px] border-stroke-strong p-5 shadow-brutal-sm overflow-hidden">
        <span
          className="absolute top-1/2 -translate-y-1/2 -left-3 h-6 w-6 rounded-full bg-surface-1 border-[3px] border-stroke-strong"
          aria-hidden
        />
        <span
          className="absolute top-1/2 -translate-y-1/2 -right-3 h-6 w-6 rounded-full bg-surface-1 border-[3px] border-stroke-strong"
          aria-hidden
        />
        {/* Cabecera ticket */}
        <div className="flex items-start justify-between gap-3">
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
            {selectedRestaurant?.address || address ? (
              <div className="text-[11px] text-on-base-muted mt-1 truncate">
                {selectedRestaurant?.address || address}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {mode === 'desktop' ? (
              <button
                type="button"
                onClick={() => setCartCollapsed(true)}
                className="h-9 w-9 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
                aria-label="Ocultar carrito"
                title="Ocultar carrito"
              >
                <ChevronRight size={16} />
              </button>
            ) : null}
            {mode === 'drawer' ? (
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>

        {/* Selector de tipo */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong p-1">
          {ORDER_TYPES.map((t) => {
            const active = t.id === orderType;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setOrderType(t.id)}
                className={`flex-1 rounded-xl px-3 py-2 text-xs font-bangers tracking-widest uppercase transition-all ${
                  active
                    ? 'bg-primary text-on-primary shadow-brutal-sm'
                    : 'text-on-base-muted hover:text-on-base'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <TicketNotch />

        {/* Items del pedido */}
        <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase">
          Tu pedido
        </div>

        <div className="mt-2 space-y-3">
          {cartItems.length ? (
            cartItems.map((it) => (
              <div
                key={it.dishId}
                className="flex items-center gap-3 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-3 py-2"
              >
                <DishImage
                  src={it.photo}
                  alt={it.name}
                  className="h-12 w-12 rounded-xl border-[3px] border-stroke-strong shrink-0"
                  iconSize={16}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bangers tracking-wide text-on-base truncate">
                    {it.name}
                  </div>
                  <div className="text-xs text-on-base-muted">
                    ${it.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => decQty(it.dishId)}
                    className="h-8 w-8 rounded-xl bg-surface-2 border-[3px] border-stroke-strong flex items-center justify-center"
                    aria-label="Disminuir"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="w-6 text-center text-sm font-black text-on-base">
                    {it.qty}
                  </div>
                  <button
                    type="button"
                    onClick={() => incQty(it.dishId)}
                    className="h-8 w-8 rounded-xl bg-surface-2 border-[3px] border-stroke-strong flex items-center justify-center"
                    aria-label="Aumentar"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(it.dishId)}
                    className="h-8 w-8 rounded-xl bg-surface-2 border-[3px] border-stroke-strong flex items-center justify-center text-on-base-muted"
                    aria-label="Eliminar"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-6 text-sm text-on-base-muted text-center">
              Tu carrito está vacío.
            </div>
          )}
        </div>

        <TicketNotch />

        {/* Cupón */}
        <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase">
          Cupón
        </div>
        <div className="mt-2 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-2 flex items-center gap-3">
          <Ticket size={18} className="text-secondary" />
          <input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="TRYNEW, EXPRESS5…"
            className="w-full bg-transparent outline-none text-sm font-semibold text-on-base placeholder:text-on-base-faint"
          />
        </div>

        {/* Detalles */}
        <div className="mt-4 space-y-1 text-sm font-semibold">
          <div className="flex items-center justify-between text-on-base-muted">
            <span>Sub total</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-on-base-muted">
            <span>Delivery</span>
            <span>${totals.deliveryCharge.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-on-base-muted">
            <span>Descuento</span>
            <span>-${totals.discount.toFixed(2)}</span>
          </div>
        </div>

        <TicketNotch />

        {/* Método de pago */}
        <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase">
          Método de pago
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map(({ id, label, Icon }) => {
            const active = paymentMethod === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPaymentMethod(id)}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-[3px] border-stroke-strong font-bangers tracking-widest text-sm transition-all ${
                  active
                    ? 'bg-secondary text-on-secondary shadow-brutal-sm'
                    : 'bg-surface-3 text-on-base hover:bg-surface-4'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-5 rounded-2xl bg-primary text-on-primary border-[3px] border-stroke-strong shadow-brutal-sm px-4 py-4 flex items-center justify-between">
          <span className="font-bangers tracking-widest text-lg">TOTAL</span>
          <span className="font-bangers text-3xl">${totals.total.toFixed(2)}</span>
        </div>

        {localError ? (
          <div className="mt-3 rounded-2xl border-[3px] border-stroke-strong bg-primary/10 px-3 py-2 text-xs text-primary font-bold">
            {localError}
          </div>
        ) : null}

        <button
          type="button"
          disabled={disableContinue}
          onClick={handleContinue}
          className="mt-4 w-full bg-secondary text-on-secondary font-bangers tracking-widest text-xl py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? 'CARGANDO…' : 'CONTINUAR'}
        </button>
      </div>
    </div>
  );
};
