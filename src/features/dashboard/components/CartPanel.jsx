import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  CreditCard,
  Minus,
  Plus,
  Ticket,
  Wallet,
  X,
  Phone,
  Edit3,
  Check,
  Trash2,
  MapPin,
} from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useUIStore } from '../../../shared/store/useUIStore';
import { useClientStore } from '../store/useClientStore';
import toast from 'react-hot-toast';
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
  <div className="relative my-3 flex-none">
    <div className="border-t-2 border-dashed border-stroke-soft" />
    <span className="absolute -top-2 -left-3 h-4 w-4 rounded-full bg-surface-1 border-[3px] border-stroke-strong" />
    <span className="absolute -top-2 -right-3 h-4 w-4 rounded-full bg-surface-1 border-[3px] border-stroke-strong" />
  </div>
);

export const CartPanel = ({ mode = 'desktop', onClose, onContinue }) => {
  const setCartCollapsed = useUIStore((s) => s.setCartCollapsed);

  const orderType = useOrderStore((s) => s.orderType);
  const promoCode = useOrderStore((s) => s.promoCode);
  const promotionId = useOrderStore((s) => s.promotionId);
  const cartItems = useOrderStore((s) => s.cartItems);
  const paymentMethod = useOrderStore((s) => s.paymentMethod);
  const submitting = useOrderStore((s) => s.submitting);
  const setOrderType = useOrderStore((s) => s.setOrderType);
  const setPaymentMethod = useOrderStore((s) => s.setPaymentMethod);
  const incQty = useOrderStore((s) => s.incQty);
  const decQty = useOrderStore((s) => s.decQty);
  const getTotals = useOrderStore((s) => s.getTotals);
  const clearCart = useOrderStore((s) => s.clearCart);
  const clearPromotion = useOrderStore((s) => s.clearPromotion);
  const activePromotion = useOrderStore((s) => s.activePromotion);

  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);
  const restaurants = useRestaurantsStore((s) => s.restaurants);

  const clientInfo = useClientStore((s) => s.info);
  const updatePhone = useClientStore((s) => s.updatePhone);
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);

  const addressId = useOrderStore((s) => s.addressId);
  const setAddressId = useOrderStore((s) => s.setAddressId);
  const openOrderWizard = useUIStore((s) => s.openOrderWizard);

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  const addresses = clientInfo?.addresses || (clientInfo?.address ? [clientInfo.address] : []);
  const selectedAddress = addresses.find((a) => (a._id || a.id) === addressId) || addresses.find((a) => a.isDefault) || addresses[0];

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => (r._id || r.id) === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  const totals = useMemo(
    () => getTotals(),
    [getTotals, cartItems, promoCode, promotionId, activePromotion, orderType],
  );
  const [localError, setLocalError] = useState(null);

  const handleStartPhoneEdit = () => {
    setPhoneValue(clientInfo?.phone || '');
    setEditingPhone(true);
  };

  const handleSavePhone = async () => {
    const trimmed = phoneValue.trim();
    if (!trimmed) {
      toast.error('Ingresa un número de teléfono válido');
      return;
    }
    const result = await updatePhone(trimmed);
    if (result.success) {
      await fetchMyInfo();
      setEditingPhone(false);
      toast.success('Teléfono actualizado');
    } else {
      toast.error(result.error || 'No se pudo actualizar el teléfono');
    }
  };

  const handleCancelPhoneEdit = () => {
    setEditingPhone(false);
    setPhoneValue('');
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
    toast.success('Carrito limpiado');
  };

  const handleContinue = () => {
    if (!cartItems.length) {
      setLocalError('Tu carrito está vacío.');
      return;
    }
    if (!selectedRestaurantId) {
      setLocalError('Selecciona un restaurante.');
      return;
    }
    if (orderType === 'DOMICILIO' && !addressId) {
      setLocalError('Agrega una dirección de entrega.');
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
    submitting || !cartItems.length || !selectedRestaurantId || !paymentMethod ||
    (orderType === 'DOMICILIO' && !addressId);

  return (
    <div id="tour-cart" className="flex flex-col h-full">
      <div className="flex flex-col flex-1 min-h-0 bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal-sm overflow-hidden">
        
        {/* Header - fixed height */}
        <div className="px-5 pt-5 pb-3 flex-none">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase">
                Resumen
              </div>
              <div className="font-bangers tracking-wider text-xl text-on-base">
                Tu pedido
              </div>
              <div className="text-xs text-on-base-muted mt-0.5 truncate">
                {selectedRestaurant?.name || 'Selecciona un restaurante'}
              </div>
              {editingPhone ? (
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="tel"
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    className="bg-surface-3 border-[2px] border-stroke-strong rounded-lg px-2 py-1 text-xs w-24"
                    placeholder="Tel..."
                    autoFocus
                  />
                  <button onClick={handleSavePhone} className="text-secondary">
                    <Check size={12} />
                  </button>
                  <button onClick={handleCancelPhoneEdit} className="text-on-base-muted">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-1">
                  <Phone size={10} className="text-secondary" />
                  <span className="text-[10px] text-on-base-muted">
                    {clientInfo?.phone || 'Sin teléfono'}
                  </span>
                  <button onClick={handleStartPhoneEdit} className="text-on-base-muted hover:text-secondary transition-colors">
                    <Edit3 size={10} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {mode === 'desktop' && (
                <button
                  type="button"
                  onClick={() => setCartCollapsed(true)}
                  className="h-8 w-8 rounded-xl bg-surface-3 border-[2px] border-stroke-strong flex items-center justify-center"
                >
                  <ChevronRight size={14} />
                </button>
              )}
              {mode === 'drawer' && (
                <button type="button" onClick={onClose} className="h-8 w-8 rounded-xl bg-surface-3 border-[2px] border-stroke-strong flex items-center justify-center">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-surface-3 border-[2px] border-stroke-strong p-0.5 mt-3">
            {ORDER_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOrderType(t.id)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-[10px] font-bangers tracking-widest uppercase transition-all ${
                  t.id === orderType
                    ? 'bg-primary text-on-primary shadow-brutal-sm'
                    : 'text-on-base-muted hover:text-on-base'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {orderType === 'DOMICILIO' && (
            <div className="mt-3">
              {addresses.length > 0 ? (
                <div 
                  className="flex items-center gap-2 bg-surface-3 border-[2px] border-stroke-strong rounded-xl px-3 py-2 cursor-pointer hover:border-secondary transition-colors"
                  onClick={() => setShowAddressPicker(true)}
                >
                  <MapPin size={12} className="text-secondary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-on-base font-semibold truncate">
                      {selectedAddress ? `${selectedAddress.addressLine} ${selectedAddress.houseNumber}` : 'Selecciona dirección'}
                    </div>
                    {selectedAddress?.alias && (
                      <div className="text-[10px] text-on-base-muted">{selectedAddress.alias}</div>
                    )}
                  </div>
                  <Edit3 size={10} className="text-on-base-muted shrink-0" />
                </div>
              ) : (
                <button
                  onClick={openOrderWizard}
                  className="w-full flex items-center justify-center gap-2 bg-surface-3 border-[2px] border-dashed border-stroke-strong rounded-xl px-3 py-2 text-[10px] font-bangers tracking-widest text-on-base-muted hover:text-primary hover:border-primary transition-colors"
                >
                  <MapPin size={12} />
                  AGREGAR DIRECCIÓN
                </button>
              )}
            </div>
          )}

          {/* Payment Method Selector */}
          <div className="mt-3">
            <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase mb-1">
              Método de Pago
            </div>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.Icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl border-[2px] border-stroke-strong py-2 px-3 text-[10px] font-bangers tracking-widest uppercase transition-all ${
                      paymentMethod === m.id
                        ? 'bg-secondary text-on-secondary shadow-brutal-sm'
                        : 'bg-surface-3 text-on-base-muted hover:text-on-base'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3">
            {activePromotion ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-secondary/15 border-[2px] border-secondary px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Ticket size={12} className="text-secondary shrink-0" />
                    <span className="text-[10px] font-bangers tracking-widest text-on-base truncate uppercase">
                      {activePromotion.title} · {activePromotion.discountPercentage}% OFF
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => clearPromotion()}
                    aria-label="Quitar promoción"
                    className="h-6 w-6 rounded-md bg-surface-3 border-[2px] border-stroke-strong flex items-center justify-center text-on-base-muted hover:text-primary shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="text-[10px] text-on-base-muted px-1">
                  Pedido con promoción — el descuento aplica solo a los platos elegidos desde Promociones.
                </p>
              </div>
            ) : (
              <Link
                to="/dashboard/promotions"
                className="text-[10px] font-semibold text-secondary hover:underline"
              >
                ¿Quieres usar una promoción? Ir a Promociones
              </Link>
            )}
          </div>
        </div>

        <TicketNotch />

        {/* Items List - flexible grow, scrollable */}
        <div className="flex-1 overflow-y-auto px-5 min-h-0 custom-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] text-on-base-muted font-bangers tracking-widest uppercase">
              Tu pedido
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-[10px] text-on-base-muted hover:text-error flex items-center gap-1"
              >
                <Trash2 size={10} />
                <span>Limpiar</span>
              </button>
            )}
          </div>
          
          <div className="space-y-2 pb-3">
            {cartItems.length ? (
              cartItems.map((it) => (
                <div
                  key={it.dishId}
                  className="flex items-center gap-2 rounded-xl bg-surface-3 border-[2px] border-stroke-strong px-3 py-2"
                >
                  <DishImage
                    src={it.photo}
                    alt={it.name}
                    className="h-10 w-10 rounded-lg border-[2px] border-stroke-strong shrink-0"
                    iconSize={12}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-on-base truncate">
                      {it.name}
                    </div>
                    <div className="text-[10px] text-on-base-muted">
                      Q{it.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => decQty(it.dishId)}
                      aria-label={`Disminuir cantidad de ${it.name}`}
                      className="h-6 w-6 rounded-md bg-surface-2 border-[2px] border-stroke-strong flex items-center justify-center"
                    >
                      <Minus size={10} />
                    </button>
                    <div className="w-4 text-center text-xs font-bold text-on-base">
                      {it.qty}
                    </div>
                    <button
                      type="button"
                      onClick={() => incQty(it.dishId)}
                      aria-label={`Aumentar cantidad de ${it.name}`}
                      className="h-6 w-6 rounded-md bg-surface-2 border-[2px] border-stroke-strong flex items-center justify-center"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-surface-3 border-[2px] border-stroke-strong px-4 py-4 text-xs text-on-base-muted text-center">
                Carrito vacío
              </div>
            )}
          </div>
        </div>

        {/* Footer - fixed at bottom */}
        <div className="flex-none px-5 pb-5">
          <div className="space-y-1 text-xs mb-3">
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

          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bangers tracking-wider text-on-base">Total</span>
            <span className="text-lg font-bangers tracking-wider text-on-base">Q{totals.total.toFixed(2)}</span>
          </div>

          <button
            type="button"
            disabled={disableContinue}
            onClick={handleContinue}
            className="w-full bg-secondary text-on-secondary font-bangers tracking-widest text-base py-2.5 rounded-xl border-[2px] border-stroke-strong shadow-brutal-sm disabled:opacity-50"
          >
            {submitting ? '...' : 'CONFIRMAR'}
          </button>
          
          {localError && (
            <div className="mt-2 text-[10px] text-error font-bold text-center">
              {localError}
            </div>
          )}
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm" onClick={() => setShowClearConfirm(false)} />
          <div className="relative w-full max-w-xs bg-surface-2 border-[3px] border-stroke-strong rounded-2xl shadow-brutal p-5">
            <h3 className="font-bangers text-xl text-on-base mb-1">¿Limpiar carrito?</h3>
            <p className="text-xs text-on-base-muted mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-3 py-2 rounded-lg border-[2px] border-stroke-strong font-bangers text-[10px] tracking-widest text-on-base hover:bg-surface-3"
              >
                CANCELAR
              </button>
              <button
                onClick={handleClearCart}
                className="flex-1 px-3 py-2 rounded-lg border-[2px] border-stroke-strong bg-primary text-on-primary font-bangers text-[10px] tracking-widest shadow-brutal-sm"
              >
                LIMPIAR
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddressPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm" onClick={() => setShowAddressPicker(false)} />
          <div className="relative w-full max-w-xs bg-surface-2 border-[3px] border-stroke-strong rounded-2xl shadow-brutal p-5 max-h-[70vh] overflow-y-auto">
            <h3 className="font-bangers text-xl text-on-base mb-3">Dirección</h3>
            <div className="space-y-2">
              {addresses.map((addr) => {
                const id = addr._id || addr.id;
                return (
                  <button
                    key={id}
                    onClick={() => { setAddressId(id); setShowAddressPicker(false); }}
                    className={`w-full text-left p-3 rounded-xl border-[2px] flex items-center justify-between ${
                      addressId === id ? 'border-secondary bg-secondary/10' : 'border-stroke-soft bg-surface-3'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold text-on-base">{addr.addressLine} {addr.houseNumber}</div>
                      <div className="text-[10px] text-on-base-muted">{addr.alias || 'Dirección'}</div>
                    </div>
                    {addressId === id && <Check size={14} className="text-secondary" />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { setShowAddressPicker(false); openOrderWizard(); }}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-surface-3 border-[2px] border-stroke-strong rounded-xl px-3 py-2 text-[10px] font-bangers tracking-widest text-on-base-muted"
            >
              <MapPin size={12} />
              AGREGAR NUEVA
            </button>
            <button
              onClick={() => setShowAddressPicker(false)}
              className="mt-2 w-full px-3 py-2 rounded-xl border-[2px] border-stroke-strong font-bangers text-[10px] tracking-widest text-on-base"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};