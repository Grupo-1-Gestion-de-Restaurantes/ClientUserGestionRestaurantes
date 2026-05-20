import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Store, X, Edit3, Check } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { useRestaurantsStore } from '../store/useRestaurantsStore';
import { useClientStore } from '../store/useClientStore';
import { useUIStore } from '../../../shared/store/useUIStore';
import { showError, showSuccess } from '../../../shared/utils/toast';

const formatMoney = (n) => `Q${Number(n || 0).toFixed(2)}`;

export const OrderConfirmationModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  const cartItems = useOrderStore((s) => s.cartItems);
  const paymentMethod = useOrderStore((s) => s.paymentMethod);
  const submitting = useOrderStore((s) => s.submitting);
  const getTotals = useOrderStore((s) => s.getTotals);
  const confirmOrder = useOrderStore((s) => s.confirmOrder);
  const orderType = useOrderStore((s) => s.orderType);
  const addressId = useOrderStore((s) => s.addressId);

  const restaurants = useRestaurantsStore((s) => s.restaurants);
  const selectedRestaurantId = useRestaurantsStore((s) => s.selectedRestaurantId);

  const promoCode = useOrderStore((s) => s.promoCode);
  const promotionId = useOrderStore((s) => s.promotionId);

  const activePromotion = useOrderStore((s) => s.activePromotion);

  const clientInfo = useClientStore((s) => s.info);
  const fetchMyInfo = useClientStore((s) => s.fetchMyInfo);

  useEffect(() => {
    if (!open) return;
    if (clientInfo) return;
    fetchMyInfo();
  }, [open, clientInfo, fetchMyInfo]);

  const totals = useMemo(() => getTotals(), [getTotals, cartItems, orderType, promoCode, promotionId, activePromotion]);

  const selectedRestaurant = useMemo(
    () => restaurants.find((r) => (r._id || r.id) === selectedRestaurantId),
    [restaurants, selectedRestaurantId],
  );

  const addresses = clientInfo?.addresses || (clientInfo?.address ? [clientInfo.address] : []);

  const selectedAddress = useMemo(() => {
    if (!addresses.length) return null;
    if (addressId) return addresses.find((a) => (a._id || a.id) === addressId) || null;
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  }, [addresses, addressId]);

  const canConfirm =
    !!cartItems.length && !!selectedRestaurantId && !!paymentMethod &&
    (orderType !== 'DOMICILIO' || !!selectedAddress);

  const setAddressId = useOrderStore((s) => s.setAddressId);
  const openOrderWizard = useUIStore((s) => s.openOrderWizard);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden />

      <div className="relative w-full max-w-5xl h-[90vh] rounded-3xl bg-surface-2 border-[3px] border-stroke-strong shadow-brutal p-6 md:p-8 flex flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 flex-none">
          <div className="min-w-0">
            <div className="text-xs text-on-base-muted tracking-widest uppercase">Confirmación</div>
            <div className="font-bangers tracking-wider text-3xl text-on-base truncate">
              Revisa tu pedido
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-2xl bg-surface-3 border-[3px] border-stroke-strong flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 flex-none">
          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-4 py-3">
            <div className="text-[11px] tracking-widest uppercase text-on-base-muted flex items-center gap-2">
              <Store size={14} /> Restaurante
            </div>
            <div className="mt-1 font-semibold text-on-base truncate">
              {selectedRestaurant?.name || '—'}
            </div>
            {selectedRestaurant?.phone ? (
              <div className="mt-1 text-sm text-on-base-muted flex items-center gap-2">
                <Phone size={14} /> {selectedRestaurant.phone}
              </div>
            ) : null}
          </div>

          <div className={`rounded-2xl bg-surface-3 border-[3px] px-4 py-3 ${orderType === 'DOMICILIO' ? 'cursor-pointer hover:border-secondary transition-colors' : 'border-stroke-soft'}`} onClick={() => orderType === 'DOMICILIO' && setShowAddressPicker(true)}>
            <div className="text-[11px] tracking-widest uppercase text-on-base-muted flex items-center gap-2">
              <MapPin size={14} /> Dirección
              {orderType === 'DOMICILIO' && <Edit3 size={12} className="ml-auto" />}
            </div>
            {selectedAddress ? (
              <div className="mt-1 text-sm text-on-base">
                <div className="font-semibold truncate">
                  {selectedAddress.addressLine} {selectedAddress.houseNumber}
                </div>
                {selectedAddress.alias ? (
                  <div className="text-on-base-muted text-xs truncate">{selectedAddress.alias}</div>
                ) : null}
              </div>
            ) : (
              <div className="mt-1 text-sm text-on-base-muted">
                {orderType === 'DOMICILIO' ? 'Toca para configurar' : 'No aplica'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto bg-surface-3 border-[3px] border-stroke-strong rounded-2xl p-4">
          <div className="text-[11px] tracking-widest uppercase text-on-base-muted mb-3">Detalle del pedido</div>
          {cartItems.length ? (
            <ul className="space-y-3">
              {cartItems.map((it) => (
                <li key={it.dishId} className="flex items-center justify-between gap-4 p-3 bg-surface-2 rounded-xl border-[2px] border-stroke-soft">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-on-base font-semibold">{it.qty}× {it.name}</div>
                    {it.subtitle && <div className="text-xs text-on-base-muted">{it.subtitle}</div>}
                  </div>
                  <div className="text-on-base-muted font-semibold whitespace-nowrap">
                    {formatMoney(it.price * it.qty)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-on-base-muted">Tu carrito está vacío.</div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm font-semibold flex-none">
          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-3 py-2 flex items-center justify-between">
            <span className="text-on-base-muted text-xs">Sub total</span>
            <span className="text-on-base font-bold">{formatMoney(totals.subtotal)}</span>
          </div>
          {orderType === 'DOMICILIO' && (
            <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-3 py-2 flex items-center justify-between">
              <span className="text-on-base-muted text-xs">Delivery</span>
              <span className="text-on-base font-bold">{formatMoney(totals.deliveryCharge)}</span>
            </div>
          )}
          <div className="rounded-2xl bg-surface-3 border-[3px] border-stroke-strong px-3 py-2 flex items-center justify-between">
            <span className="text-on-base-muted text-xs">Descuento</span>
            <span className="text-on-base font-bold">-{formatMoney(totals.discount)}</span>
          </div>
          <div className="rounded-2xl bg-primary text-on-primary border-[3px] border-stroke-strong px-3 py-2 flex items-center justify-between shadow-brutal-sm">
            <span className="font-bangers tracking-widest text-xs">TOTAL</span>
            <span className="font-bangers text-xl">{formatMoney(totals.total)}</span>
          </div>
        </div>

        <button
          type="button"
          disabled={!canConfirm || submitting}
          onClick={async () => {
            if (!selectedRestaurantId) {
              showError('Selecciona un restaurante.');
              return;
            }
            if (orderType === 'DOMICILIO' && !selectedAddress) {
              showError('Agrega una dirección para poder continuar.');
              return;
            }
            const res = await confirmOrder({ restaurantId: selectedRestaurantId });
            if (res.success) {
              showSuccess(
                res.data?.invoice?.invoiceNumber
                  ? `Pedido creado · ${res.data.invoice.invoiceNumber}`
                  : 'Pedido creado',
              );
              onClose?.();
              navigate('/dashboard/history');
            } else if (res.error) {
              showError(res.error);
            }
          }}
          className="mt-5 w-full bg-secondary text-on-secondary font-bangers tracking-widest text-xl py-3 rounded-2xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-none"
        >
          {submitting ? 'CONFIRMANDO…' : 'CONFIRMAR PEDIDO'}
        </button>

        {!canConfirm ? (
          <div className="mt-3 text-xs text-on-base-muted text-center flex-none">
            Completa la configuración para confirmar.
          </div>
        ) : null}
      </div>

      {showAddressPicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm" onClick={() => setShowAddressPicker(false)} />
          <div className="relative w-full max-w-sm bg-surface-2 border-[3px] border-stroke-strong rounded-3xl shadow-brutal p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bangers text-2xl text-on-base mb-4">Cambiar Dirección</h3>
            <div className="space-y-3">
              {addresses.map((addr) => {
                const id = addr._id || addr.id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setAddressId(id);
                      setShowAddressPicker(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border-[3px] flex items-center justify-between transition-all ${
                      addressId === id
                        ? 'border-secondary bg-secondary/10'
                        : 'border-stroke-soft bg-surface-3 hover:border-stroke-strong'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-on-base">{addr.addressLine} {addr.houseNumber}</div>
                      <div className="text-xs text-on-base-muted">{addr.alias || 'Dirección'}</div>
                    </div>
                    {addressId === id && <Check size={18} className="text-secondary" />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                setShowAddressPicker(false);
                onClose?.();
                setTimeout(() => openOrderWizard(), 300);
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-surface-3 border-[3px] border-stroke-strong rounded-xl px-4 py-3 text-xs font-bangers tracking-widest text-on-base-muted hover:text-primary hover:border-primary transition-colors"
            >
              <MapPin size={14} />
              AGREGAR NUEVA DIRECCIÓN
            </button>
            <button
              onClick={() => setShowAddressPicker(false)}
              className="mt-3 w-full px-4 py-3 rounded-xl border-[3px] border-stroke-strong font-bangers tracking-widest text-on-base hover:bg-surface-3 transition-all"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};